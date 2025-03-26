import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Link
} from '@mui/material';
import { toast } from 'react-toastify';

// Icons
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import SchoolIcon from '@mui/icons-material/School';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const Help: React.FC = () => {
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleContactFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };

  const handleContactFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Placeholder for form submission
    toast.success('Your message has been sent. Our support team will contact you soon.');
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  // FAQ data
  const faqs: FAQ[] = [
    {
      question: 'How do I add a new vehicle to the fleet?',
      answer: 'To add a new vehicle, navigate to the Vehicles page and click on the "Add Vehicle" button in the top right corner. Fill in the required information in the form and click "Save".',
    },
    {
      question: 'How do I assign a driver to a vehicle?',
      answer: 'You can assign a driver to a vehicle in two ways: 1) From the Vehicle detail page, click on "Assign Driver" and select a driver from the dropdown. 2) From the Driver detail page, click on "Assign Vehicle" and select a vehicle from the dropdown.',
    },
    {
      question: 'How do I track fuel consumption?',
      answer: 'To track fuel consumption, go to the Fuel page and add new fuel records whenever you refuel a vehicle. The system will automatically calculate fuel efficiency based on the odometer readings and fuel quantity.',
    },
    {
      question: 'How do I schedule maintenance for a vehicle?',
      answer: 'Navigate to the Maintenance page and click on "Schedule Maintenance". Select the vehicle, maintenance type, and scheduled date. You can also set reminders for upcoming maintenance tasks.',
    },
    {
      question: 'How do I create and assign routes?',
      answer: 'Go to the Routes page and click "Create Route". Define the start and end points, add waypoints if needed, and assign a vehicle and driver. Once created, the route will be available to the assigned driver.',
    },
    {
      question: 'How do I generate reports?',
      answer: 'Navigate to the Reports page, select the report type (Vehicle Utilization, Fuel Consumption, Maintenance Cost, or Driver Performance), set the date range and filters, then click "Generate Report".',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Help & Support</Typography>
      
      <Grid container spacing={3}>
        {/* Quick Links */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <HelpOutlineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Quick Links
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem button component={Link} href="#documentation">
                  <ListItemIcon>
                    <ArticleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Documentation" />
                </ListItem>
                <ListItem button component={Link} href="#tutorials">
                  <ListItemIcon>
                    <VideoLibraryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Video Tutorials" />
                </ListItem>
                <ListItem button component={Link} href="#contact">
                  <ListItemIcon>
                    <ContactSupportIcon />
                  </ListItemIcon>
                  <ListItemText primary="Contact Support" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Getting Started */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Getting Started
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography paragraph>
                Welcome to the FleetOrbit System! This platform helps you manage your entire fleet operations efficiently. Here's how to get started:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="1. Set up your company profile" 
                    secondary="Navigate to Settings > Company to update your company information."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="2. Add your vehicles" 
                    secondary="Go to the Vehicles page to add all your fleet vehicles with their details."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="3. Add your drivers" 
                    secondary="Visit the Drivers page to add driver information and assign vehicles."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="4. Start tracking" 
                    secondary="Begin recording fuel, maintenance, and routes to get insights into your fleet performance."
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* FAQs */}
        <Grid item xs={12} id="faqs">
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {faqs.map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`faq-content-${index}`}
                  id={`faq-header-${index}`}
                >
                  <Typography fontWeight="medium">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>
        
        {/* Documentation */}
        <Grid item xs={12} md={6} id="documentation">
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              <ArticleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Documentation
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography paragraph>
              Explore our comprehensive documentation to learn about all features and functionalities of the FleetOrbit System.
            </Typography>
            <List>
              <ListItem button component={Link} href="#">
                <ListItemText primary="User Manual" secondary="Complete guide to using the system" />
              </ListItem>
              <ListItem button component={Link} href="#">
                <ListItemText primary="Administrator Guide" secondary="Advanced settings and configurations" />
              </ListItem>
              <ListItem button component={Link} href="#">
                <ListItemText primary="API Documentation" secondary="For developers integrating with our system" />
              </ListItem>
              <ListItem button component={Link} href="#">
                <ListItemText primary="Release Notes" secondary="Latest features and updates" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Video Tutorials */}
        <Grid item xs={12} md={6} id="tutorials">
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              <VideoLibraryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Video Tutorials
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography paragraph>
              Watch our video tutorials to quickly learn how to use different features of the system.
            </Typography>
            <List>
              <ListItem button component={Link} href="#">
                <ListItemText primary="Getting Started" secondary="5:30 min" />
              </ListItem>
              <ListItem button component={Link} href="#">
                <ListItemText primary="Managing Vehicles" secondary="7:15 min" />
              </ListItem>
              <ListItem button component={Link} href="#">
                <ListItemText primary="Tracking Maintenance" secondary="6:45 min" />
              </ListItem>
              <ListItem button component={Link} href="#">
                <ListItemText primary="Creating Reports" secondary="8:20 min" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Contact Support */}
        <Grid item xs={12} id="contact">
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              <SupportAgentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Contact Support
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Send us a message</Typography>
                <form onSubmit={handleContactFormSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactFormChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactFormChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactFormChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={contactForm.message}
                        onChange={handleContactFormChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Other ways to reach us</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <ContactSupportIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Customer Support" 
                      secondary="+92 51 1234567"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ContactSupportIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Technical Support" 
                      secondary="support@fleetmanagement.pk"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ContactSupportIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Office Hours" 
                      secondary="Monday to Friday, 9:00 AM - 5:00 PM (PKT)"
                    />
                  </ListItem>
                </List>
                
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>Emergency Support</Typography>
                <Typography paragraph>
                  For urgent issues outside of regular business hours, please call our 24/7 emergency support line at +92 51 9876543.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Help;
