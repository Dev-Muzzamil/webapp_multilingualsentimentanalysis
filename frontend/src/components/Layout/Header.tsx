import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px 0 rgba(99,102,241,0.08)',
        borderBottom: '1.5px solid #e0e7ef',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          aria-label="open drawer"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            color: 'primary.main',
            background: 'linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%)',
            boxShadow: '0 2px 8px rgba(99,102,241,0.10)',
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #818cf8 0%, #c7d2fe 100%)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #6366f1 30%, #f472b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px',
          }}
        >
          Multilingual Sentiment Analysis
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            sx={{
              color: 'primary.main',
              background: 'rgba(99,102,241,0.08)',
              borderRadius: 2,
              '&:hover': { background: 'rgba(99,102,241,0.18)' },
            }}
          >
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            sx={{
              color: 'primary.main',
              background: 'rgba(244,114,182,0.08)',
              borderRadius: 2,
              ml: 1,
              '&:hover': { background: 'rgba(244,114,182,0.18)' },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;