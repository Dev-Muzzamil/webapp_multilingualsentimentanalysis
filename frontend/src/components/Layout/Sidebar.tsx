import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Psychology as PsychologyIcon,
  DataUsage as DataUsageIcon,
  Analytics as AnalyticsIcon,
  WifiTethering as RealTimeIcon,
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Sentiment Analysis', icon: <PsychologyIcon />, path: '/sentiment' },
  { text: 'Data Sources', icon: <DataUsageIcon />, path: '/data-sources' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Real-time Monitor', icon: <RealTimeIcon />, path: '/real-time' },
];

const drawerWidth = 240;


const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(90deg, #6366f1 30%, #f472b6 100%)', color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: 1, mb: 1, borderRadius: 2 }}>
        <span style={{ fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif' }}>SentimentAI</span>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleItemClick(item.path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                transition: 'background 0.2s',
                '&.Mui-selected, &.Mui-selected:hover': {
                  background: 'rgba(244, 114, 182, 0.18)',
                  color: '#f472b6',
                },
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;