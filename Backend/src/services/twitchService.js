const WebSocket = require('ws');
const EventEmitter = require('events');
const axios = require('axios');

class TwitchService extends EventEmitter {
  constructor() {
    super();
    this.chatWS = null;
    this.isConnected = false;
    this.isConfigured = false;
    this.joinedChannels = new Set();
    this.accessToken = null;
    
    this.checkConfiguration();
  }

  checkConfiguration() {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    
    if (clientId && clientSecret) {
      this.isConfigured = true;
      console.log('Twitch service configured successfully');
    } else {
      console.log('Twitch credentials not configured - Twitch service will be disabled');
    }
  }

  // Get OAuth token from Twitch
  async getAccessToken() {
    try {
      if (!this.isConfigured) {
        throw new Error('Twitch service is not configured. Please provide valid client credentials.');
      }

      const response = await axios.post('https://id.twitch.tv/oauth2/token', {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      });

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Twitch access token:', error);
      throw error;
    }
  }

  // Connect to Twitch IRC chat
  async connectToChat() {
    try {
      if (this.isConnected) {
        return { success: true, message: 'Already connected' };
      }

      this.chatWS = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

      this.chatWS.on('open', () => {
        // Send capability requests and authentication
        this.chatWS.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        this.chatWS.send('PASS oauth:' + (this.accessToken || 'justinfan12345')); // Anonymous if no token
        this.chatWS.send('NICK justinfan12345'); // Anonymous user
        this.isConnected = true;
        this.emit('connected', { platform: 'twitch' });
      });

      this.chatWS.on('message', (data) => {
        this.handleChatMessage(data.toString());
      });

      this.chatWS.on('error', (error) => {
        console.error('Twitch chat error:', error);
        this.emit('error', { platform: 'twitch', error: error.message });
      });

      this.chatWS.on('close', () => {
        this.isConnected = false;
        this.emit('disconnected', { platform: 'twitch' });
      });

      return { success: true, message: 'Connecting to Twitch chat' };

    } catch (error) {
      console.error('Error connecting to Twitch chat:', error);
      throw error;
    }
  }

  // Handle incoming chat messages
  handleChatMessage(rawMessage) {
    const lines = rawMessage.split('\r\n');
    
    for (const line of lines) {
      if (line.includes('PRIVMSG')) {
        const parsed = this.parseIRCMessage(line);
        if (parsed) {
          const messageData = {
            id: `twitch_${Date.now()}_${Math.random()}`,
            text: parsed.message,
            author: parsed.username,
            timestamp: new Date(),
            platform: 'twitch',
            metadata: {
              channel: parsed.channel,
              tags: parsed.tags,
              isSubscriber: parsed.tags.subscriber === '1',
              isModerator: parsed.tags.mod === '1',
              userType: parsed.tags['user-type'] || 'viewer'
            }
          };

          this.emit('newData', messageData);
        }
      }
      
      // Handle PING messages
      if (line.startsWith('PING')) {
        this.chatWS.send('PONG :tmi.twitch.tv');
      }
    }
  }

  // Parse IRC message format
  parseIRCMessage(line) {
    try {
      // Extract tags if present
      let tags = {};
      if (line.startsWith('@')) {
        const tagEnd = line.indexOf(' ');
        const tagString = line.substring(1, tagEnd);
        const tagPairs = tagString.split(';');
        
        for (const pair of tagPairs) {
          const [key, value] = pair.split('=');
          tags[key] = value;
        }
        
        line = line.substring(tagEnd + 1);
      }

      // Parse the rest of the message
      const match = line.match(/:(\w+)!\w+@\w+\.tmi\.twitch\.tv PRIVMSG #(\w+) :(.+)/);
      if (match) {
        return {
          username: match[1],
          channel: match[2],
          message: match[3],
          tags: tags
        };
      }
      return null;
    } catch (error) {
      console.error('Error parsing IRC message:', error);
      return null;
    }
  }

  // Join a Twitch channel
  async joinChannel(channelName) {
    try {
      if (!this.isConnected) {
        await this.connectToChat();
        // Wait a bit for connection to establish
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const channel = channelName.toLowerCase().replace('#', '');
      
      if (this.joinedChannels.has(channel)) {
        return { success: false, message: 'Already joined this channel' };
      }

      this.chatWS.send(`JOIN #${channel}`);
      this.joinedChannels.add(channel);

      this.emit('streamStarted', { 
        platform: 'twitch', 
        channel,
        type: 'chat'
      });

      return { success: true, channel };

    } catch (error) {
      console.error('Error joining Twitch channel:', error);
      throw error;
    }
  }

  // Leave a Twitch channel
  leaveChannel(channelName) {
    const channel = channelName.toLowerCase().replace('#', '');
    
    if (!this.joinedChannels.has(channel)) {
      return { success: false, message: 'Not in this channel' };
    }

    if (this.isConnected && this.chatWS) {
      this.chatWS.send(`PART #${channel}`);
    }
    
    this.joinedChannels.delete(channel);
    
    this.emit('streamStopped', { 
      platform: 'twitch', 
      channel,
      type: 'chat'
    });

    return { success: true, channel };
  }

  // Get stream information
  async getStreamInfo(channelName) {
    try {
      if (!this.accessToken) {
        await this.getAccessToken();
      }

      const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (response.data.data.length === 0) {
        return { isLive: false, channel: channelName };
      }

      const stream = response.data.data[0];
      return {
        isLive: true,
        channel: channelName,
        title: stream.title,
        game: stream.game_name,
        viewerCount: stream.viewer_count,
        startedAt: stream.started_at,
        language: stream.language
      };

    } catch (error) {
      console.error('Error getting Twitch stream info:', error);
      return { isLive: false, channel: channelName, error: error.message };
    }
  }

  // Get user information
  async getUserInfo(username) {
    try {
      if (!this.accessToken) {
        await this.getAccessToken();
      }

      const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (response.data.data.length === 0) {
        throw new Error('User not found');
      }

      const user = response.data.data[0];
      return {
        id: user.id,
        login: user.login,
        displayName: user.display_name,
        description: user.description,
        profileImageUrl: user.profile_image_url,
        createdAt: user.created_at
      };

    } catch (error) {
      console.error('Error getting Twitch user info:', error);
      throw error;
    }
  }

  // Disconnect from Twitch
  disconnect() {
    if (this.isConnected && this.chatWS) {
      // Leave all channels
      for (const channel of this.joinedChannels) {
        this.chatWS.send(`PART #${channel}`);
      }
      
      this.chatWS.close();
      this.joinedChannels.clear();
      this.isConnected = false;
    }
  }

  // Get active streams
  getActiveStreams() {
    return {
      channels: Array.from(this.joinedChannels),
      isConnected: this.isConnected
    };
  }

  // Get service status
  getStatus() {
    return {
      configured: this.isConfigured,
      connected: this.isConnected,
      joinedChannels: this.joinedChannels.size
    };
  }
}

module.exports = TwitchService;