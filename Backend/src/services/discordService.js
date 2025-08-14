const { Client, GatewayIntentBits } = require('discord.js');
const EventEmitter = require('events');

class DiscordService extends EventEmitter {
  constructor() {
    super();
    this.client = null;
    this.isConnected = false;
    this.isConfigured = false;
    this.monitoredChannels = new Set();
    this.monitoredGuilds = new Set();
    
    this.initializeClient();
  }

  initializeClient() {
    try {
      const botToken = process.env.DISCORD_BOT_TOKEN;
      
      if (botToken) {
        this.client = new Client({
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
          ]
        });
        this.isConfigured = true;
        console.log('Discord service configured successfully');
      } else {
        console.log('Discord bot token not configured - Discord service will be disabled');
      }
    } catch (error) {
      console.error('Error initializing Discord client:', error.message);
      this.isConfigured = false;
    }
  }

  // Check if service is configured
  checkConfiguration() {
    if (!this.isConfigured) {
      throw new Error('Discord service is not configured. Please provide a valid bot token.');
    }
  }

  // Initialize Discord connection
  async connect() {
    try {
      this.checkConfiguration();
      
      if (this.isConnected) {
        return { success: true, message: 'Already connected' };
      }

      await this.client.login(process.env.DISCORD_BOT_TOKEN);
      
      this.client.on('ready', () => {
        console.log(`Discord bot logged in as ${this.client.user.tag}`);
        this.isConnected = true;
        this.emit('connected', { platform: 'discord' });
      });

      this.client.on('messageCreate', (message) => {
        // Skip bot messages
        if (message.author.bot) return;

        // Check if we're monitoring this channel or guild
        if (this.monitoredChannels.has(message.channel.id) || 
            this.monitoredGuilds.has(message.guild?.id)) {
          
          const messageData = {
            id: message.id,
            text: message.content,
            author: message.author.username,
            timestamp: message.createdAt,
            platform: 'discord',
            metadata: {
              channelId: message.channel.id,
              channelName: message.channel.name,
              guildId: message.guild?.id,
              guildName: message.guild?.name,
              authorId: message.author.id,
              messageType: message.type,
              hasAttachments: message.attachments.size > 0,
              reactionCount: message.reactions.cache.size
            }
          };

          this.emit('newData', messageData);
        }
      });

      this.client.on('error', (error) => {
        console.error('Discord client error:', error);
        this.emit('error', { platform: 'discord', error: error.message });
      });

      this.client.on('disconnect', () => {
        this.isConnected = false;
        this.emit('disconnected', { platform: 'discord' });
      });

      return { success: true, message: 'Connected to Discord' };

    } catch (error) {
      console.error('Error connecting to Discord:', error);
      throw error;
    }
  }

  // Start monitoring a specific channel
  async startChannelMonitoring(channelId) {
    try {
      this.checkConfiguration();
      
      if (!this.isConnected) {
        await this.connect();
      }

      const channel = await this.client.channels.fetch(channelId);
      if (!channel) {
        throw new Error(`Channel not found: ${channelId}`);
      }

      this.monitoredChannels.add(channelId);
      
      this.emit('streamStarted', { 
        platform: 'discord', 
        type: 'channel',
        channelId,
        channelName: channel.name 
      });

      return { 
        success: true, 
        channelId, 
        channelName: channel.name,
        type: 'channel'
      };

    } catch (error) {
      console.error('Error starting Discord channel monitoring:', error);
      throw error;
    }
  }

  // Start monitoring a guild/server
  async startGuildMonitoring(guildId) {
    try {
      this.checkConfiguration();
      
      if (!this.isConnected) {
        await this.connect();
      }

      const guild = await this.client.guilds.fetch(guildId);
      if (!guild) {
        throw new Error(`Guild not found: ${guildId}`);
      }

      this.monitoredGuilds.add(guildId);
      
      this.emit('streamStarted', { 
        platform: 'discord', 
        type: 'guild',
        guildId,
        guildName: guild.name 
      });

      return { 
        success: true, 
        guildId, 
        guildName: guild.name,
        type: 'guild'
      };

    } catch (error) {
      console.error('Error starting Discord guild monitoring:', error);
      throw error;
    }
  }

  // Get recent messages from a channel
  async getChannelMessages(channelId, limit = 50) {
    try {
      this.checkConfiguration();
      
      if (!this.isConnected) {
        await this.connect();
      }

      const channel = await this.client.channels.fetch(channelId);
      if (!channel) {
        throw new Error(`Channel not found: ${channelId}`);
      }

      const messages = await channel.messages.fetch({ limit });
      
      return messages.map(message => ({
        id: message.id,
        text: message.content,
        author: message.author.username,
        timestamp: message.createdAt,
        platform: 'discord',
        metadata: {
          channelId: message.channel.id,
          channelName: message.channel.name,
          guildId: message.guild?.id,
          guildName: message.guild?.name,
          authorId: message.author.id,
          messageType: message.type,
          hasAttachments: message.attachments.size > 0,
          reactionCount: message.reactions.cache.size
        }
      }));

    } catch (error) {
      console.error('Error getting Discord messages:', error);
      throw error;
    }
  }

  // Stop monitoring a channel
  stopChannelMonitoring(channelId) {
    if (this.monitoredChannels.has(channelId)) {
      this.monitoredChannels.delete(channelId);
      this.emit('streamStopped', { platform: 'discord', type: 'channel', channelId });
      return { success: true, channelId, type: 'channel' };
    }
    return { success: false, message: 'Channel not being monitored' };
  }

  // Stop monitoring a guild
  stopGuildMonitoring(guildId) {
    if (this.monitoredGuilds.has(guildId)) {
      this.monitoredGuilds.delete(guildId);
      this.emit('streamStopped', { platform: 'discord', type: 'guild', guildId });
      return { success: true, guildId, type: 'guild' };
    }
    return { success: false, message: 'Guild not being monitored' };
  }

  // Stop all monitoring
  stopAllMonitoring() {
    this.monitoredChannels.clear();
    this.monitoredGuilds.clear();
    this.emit('streamStopped', { platform: 'discord', type: 'all' });
  }

  // Disconnect from Discord
  async disconnect() {
    if (this.isConnected && this.client) {
      this.stopAllMonitoring();
      await this.client.destroy();
      this.isConnected = false;
    }
  }

  // Get active monitoring info
  getActiveStreams() {
    return {
      channels: Array.from(this.monitoredChannels),
      guilds: Array.from(this.monitoredGuilds),
      isConnected: this.isConnected
    };
  }

  // Get guild/server list
  async getGuilds() {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      return this.client.guilds.cache.map(guild => ({
        id: guild.id,
        name: guild.name,
        memberCount: guild.memberCount
      }));

    } catch (error) {
      console.error('Error getting Discord guilds:', error);
      return [];
    }
  }

  // Get channels for a guild
  async getGuildChannels(guildId) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      const guild = await this.client.guilds.fetch(guildId);
      const channels = await guild.channels.fetch();

      return channels
        .filter(channel => channel.type === 0) // Text channels only
        .map(channel => ({
          id: channel.id,
          name: channel.name,
          type: channel.type
        }));

    } catch (error) {
      console.error('Error getting Discord channels:', error);
      return [];
    }
  }
  // Get service status
  getStatus() {
    return {
      configured: this.isConfigured,
      connected: this.isConnected,
      monitoredChannels: this.monitoredChannels.size,
      monitoredGuilds: this.monitoredGuilds.size
    };
  }
}

module.exports = DiscordService;