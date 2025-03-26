import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Badge,
  Tabs,
  Tab
} from '@mui/material';
import { Link } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ImageIcon from '@mui/icons-material/Image';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: {
    type: 'image' | 'document' | 'location' | 'voice';
    url: string;
    name?: string;
  }[];
}

const mockContacts: Contact[] = [
  {
    id: 'c1',
    name: 'John Doe',
    role: 'Driver',
    status: 'online',
    unreadCount: 3
  },
  {
    id: 'c2',
    name: 'Jane Smith',
    role: 'Driver',
    status: 'online',
    unreadCount: 0
  },
  {
    id: 'c3',
    name: 'Robert Johnson',
    role: 'Driver',
    status: 'away',
    lastSeen: '10 minutes ago',
    unreadCount: 0
  },
  {
    id: 'c4',
    name: 'Sarah Williams',
    role: 'Driver',
    status: 'offline',
    lastSeen: '2 hours ago',
    unreadCount: 0
  },
  {
    id: 'c5',
    name: 'Dispatch Team',
    role: 'Group',
    status: 'online',
    unreadCount: 5
  },
  {
    id: 'c6',
    name: 'Maintenance Crew',
    role: 'Group',
    status: 'online',
    unreadCount: 0
  },
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'c1',
    senderName: 'John Doe',
    content: "I've arrived at the delivery location but the customer is not available. What should I do?",
    timestamp: '2025-03-19T10:30:00',
    isRead: true
  },
  {
    id: 'm2',
    senderId: 'user',
    senderName: 'You',
    content: "Please wait for 15 minutes and try calling the customer again. If they're still unavailable, contact dispatch for further instructions.",
    timestamp: '2025-03-19T10:32:00',
    isRead: true
  },
  {
    id: 'm3',
    senderId: 'c1',
    senderName: 'John Doe',
    content: "I've been waiting for 10 minutes now. I'll try calling them again.",
    timestamp: '2025-03-19T10:45:00',
    isRead: true
  },
  {
    id: 'm4',
    senderId: 'c1',
    senderName: 'John Doe',
    content: "Customer is still not answering. Here's my current location:",
    timestamp: '2025-03-19T10:50:00',
    isRead: false,
    attachments: [
      {
        type: 'location',
        url: 'https://maps.example.com/location/123456',
        name: '350 5th Ave, New York, NY 10118'
      }
    ]
  },
  {
    id: 'm5',
    senderId: 'c1',
    senderName: 'John Doe',
    content: "I also took a photo of the delivery address to confirm I'm at the right place.",
    timestamp: '2025-03-19T10:51:00',
    isRead: false,
    attachments: [
      {
        type: 'image',
        url: 'https://example.com/images/delivery-address.jpg',
        name: 'delivery-address.jpg'
      }
    ]
  },
  {
    id: 'm6',
    senderId: 'c1',
    senderName: 'John Doe',
    content: "Should I return to the warehouse or continue to the next delivery?",
    timestamp: '2025-03-19T10:55:00',
    isRead: false
  },
];

const Messaging: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(mockContacts[0]);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  const features: FeatureCard[] = [
    {
      title: 'Notifications',
      description: 'Configure and manage system notifications',
      icon: <NotificationsIcon fontSize="large" color="primary" />,
      path: '/communication/notifications'
    },
    {
      title: 'Email Integration',
      description: 'Connect and manage email communications',
      icon: <EmailIcon fontSize="large" color="primary" />,
      path: '/communication/email'
    },
    {
      title: 'Voice Calls',
      description: 'Make voice calls directly from the platform',
      icon: <PhoneIcon fontSize="large" color="primary" />,
      path: '/communication/voice'
    },
    {
      title: 'Group Chats',
      description: 'Create and manage team communication channels',
      icon: <GroupIcon fontSize="large" color="primary" />,
      path: '/communication/groups'
    },
    {
      title: 'Broadcast Messages',
      description: 'Send announcements to multiple recipients',
      icon: <ForumIcon fontSize="large" color="primary" />,
      path: '/communication/broadcast'
    },
    {
      title: 'Communication Settings',
      description: 'Configure messaging preferences and settings',
      icon: <SettingsIcon fontSize="large" color="primary" />,
      path: '/communication/settings'
    },
  ];

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    // In a real app, this would send the message to the backend
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredContacts = mockContacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.role.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success.main';
      case 'away': return 'warning.main';
      case 'offline': return 'text.disabled';
      default: return 'text.primary';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Communication Center
        </Typography>
        <Typography variant="body1" paragraph>
          Streamline communication with drivers, dispatch teams, and other stakeholders in your fleet operations.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="communication tabs">
                <Tab label="Messaging" />
                <Tab label="Notifications" />
                <Tab label="Email" />
                <Tab label="Voice" />
              </Tabs>
            </Box>
          </Paper>
        </Grid>

        {tabValue === 0 && (
          <>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <TextField
                    placeholder="Search contacts..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                  {filteredContacts.map((contact) => (
                    <ListItem 
                      key={contact.id} 
                      button 
                      selected={selectedContact?.id === contact.id}
                      onClick={() => handleContactSelect(contact)}
                      sx={{ 
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&.Mui-selected': {
                          backgroundColor: 'primary.light',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          }
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          sx={{ 
                            '& .MuiBadge-badge': { 
                              backgroundColor: getStatusColor(contact.status),
                              boxShadow: `0 0 0 2px white`
                            }
                          }}
                        >
                          <Avatar alt={contact.name} src={contact.avatar}>
                            {contact.role === 'Group' ? <GroupIcon /> : <PersonIcon />}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">{contact.name}</Typography>
                            {contact.unreadCount ? (
                              <Chip 
                                label={contact.unreadCount} 
                                color="primary" 
                                size="small" 
                                sx={{ height: 20, minWidth: 20 }}
                              />
                            ) : null}
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {contact.role}
                            {contact.status !== 'online' && contact.lastSeen && (
                              <> • Last seen {contact.lastSeen}</>
                            )}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
                {selectedContact ? (
                  <>
                    <Box sx={{ 
                      p: 2, 
                      borderBottom: 1, 
                      borderColor: 'divider',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          sx={{ 
                            '& .MuiBadge-badge': { 
                              backgroundColor: getStatusColor(selectedContact.status),
                              boxShadow: `0 0 0 2px white`
                            }
                          }}
                        >
                          <Avatar alt={selectedContact.name} src={selectedContact.avatar}>
                            {selectedContact.role === 'Group' ? <GroupIcon /> : <PersonIcon />}
                          </Avatar>
                        </Badge>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="subtitle1">{selectedContact.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedContact.status === 'online' ? 'Online' : `Last seen ${selectedContact.lastSeen}`}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <IconButton>
                          <PhoneIcon />
                        </IconButton>
                        <IconButton>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: 'background.default' }}>
                      {mockMessages.map((message) => (
                        <Box 
                          key={message.id} 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: message.senderId === 'user' ? 'flex-end' : 'flex-start',
                            mb: 2
                          }}
                        >
                          <Box sx={{ 
                            maxWidth: '70%',
                            bgcolor: message.senderId === 'user' ? 'primary.light' : 'background.paper',
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 1
                          }}>
                            {message.senderId !== 'user' && (
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                {message.senderName}
                              </Typography>
                            )}
                            <Typography variant="body1">{message.content}</Typography>
                            
                            {message.attachments && message.attachments.map((attachment, index) => (
                              <Box key={index} sx={{ mt: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {attachment.type === 'image' && <ImageIcon sx={{ mr: 1 }} />}
                                  {attachment.type === 'document' && <AttachFileIcon sx={{ mr: 1 }} />}
                                  {attachment.type === 'location' && <LocationOnIcon sx={{ mr: 1 }} />}
                                  {attachment.type === 'voice' && <MicIcon sx={{ mr: 1 }} />}
                                  <Typography variant="body2">
                                    {attachment.name || attachment.url}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                            
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
                              {formatTime(message.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <IconButton>
                            <AttachFileIcon />
                          </IconButton>
                        </Grid>
                        <Grid item xs>
                          <TextField
                            placeholder="Type a message..."
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={messageText}
                            onChange={handleMessageChange}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                        </Grid>
                        <Grid item>
                          <IconButton>
                            <InsertEmoticonIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton color="primary" onClick={handleSendMessage} disabled={!messageText.trim()}>
                            <SendIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="h6" color="text.secondary">
                      Select a contact to start messaging
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </>
        )}

        {tabValue !== 0 && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                {tabValue === 1 && 'Notifications content would be displayed here.'}
                {tabValue === 2 && 'Email integration content would be displayed here.'}
                {tabValue === 3 && 'Voice call content would be displayed here.'}
              </Typography>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Communication Features
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography gutterBottom variant="h6" component="h2" align="center">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      component={Link} 
                      to={feature.path} 
                      variant="outlined" 
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      Explore
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messaging;
