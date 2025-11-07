import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Avatar,
  Chip,
  Stack,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  InputAdornment,
  Collapse,
  Fade,
  Slide,
  CssBaseline,
  Tooltip,
  useMediaQuery,
  Snackbar
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Work,
  Code,
  Email,
  GitHub,
  LinkedIn,
  School,
  EmojiEvents,
  Key,
  Warning,
  LocationOn,
  Phone,
  LightMode,
  DarkMode
} from '@mui/icons-material';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import { ContentCopy } from '@mui/icons-material';

// ------- Design Tokens (Light/Dark) -------
const getDesignTokens = (mode) => {
  const isDark = mode === 'dark';
  const primaryMain = '#4F46E5';
  const secondaryMain = '#38BDF8';

  return {
    palette: {
      mode,
      primary: {
        main: primaryMain,
        light: '#818CF8',
        dark: '#312E81',
      },
      secondary: {
        main: secondaryMain,
        light: '#7DD3FC',
        dark: '#0E7490',
      },
      background: {
        default: isDark ? '#0B1020' : '#F3F4F6',
        paper: isDark ? alpha('#0E1730', 0.9) : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#E8ECF8' : '#0F172A',
        secondary: isDark ? alpha('#E8ECF8', 0.75) : '#4B5563',
      }
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", Inter, "Segoe UI", sans-serif',
      h3: { fontWeight: 800, letterSpacing: '-0.02em' },
      h4: { fontWeight: 800, letterSpacing: '-0.01em' },
      subtitle1: { fontWeight: 700 },
      body1: { lineHeight: 1.7 },
      body2: { lineHeight: 1.65 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background:
              isDark
                ? 'radial-gradient(1200px 600px at 10% -20%, rgba(79,70,229,0.18), transparent 60%), radial-gradient(1000px 500px at 110% 20%, rgba(56,189,248,0.12), transparent 55%), #0B1020'
                : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 700,
            paddingInline: 22,
            transition: 'transform .25s ease, box-shadow .25s ease, background .25s ease',
            '&:active': { transform: 'translateY(0)' },
          },
          contained: {
            background: `linear-gradient(90deg, ${primaryMain}, ${secondaryMain})`,
            color: '#fff',
            boxShadow: '0 10px 24px rgba(56,189,248,0.18)',
            '&:hover': {
              background: 'linear-gradient(90deg, #4338CA, #0EA5E9)',
              boxShadow: '0 14px 28px rgba(56,189,248,0.28)',
              transform: 'translateY(-1px)',
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': { borderWidth: 2, transform: 'translateY(-1px)' },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 12, fontWeight: 600, backdropFilter: 'blur(6px)' },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            backgroundImage: 'none',
            backdropFilter: 'blur(12px)',
          },
          elevation3: { // used for Chat wrapper
            border: `1px solid ${alpha('#4F46E5', isDark ? 0.15 : 0.08)}`,
            boxShadow: isDark
              ? '0 18px 48px rgba(0,0,0,0.45)'
              : '0 18px 48px rgba(15, 23, 42, 0.08)',
          }
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 22,
            border: `1px solid ${alpha('#0f172a', 0.06)}`,
            boxShadow: '0 18px 48px rgba(15, 23, 42, 0.08)',
            transition: 'transform .3s ease, box-shadow .3s ease',
            background: isDark ? alpha('#0E1730', 0.7) : alpha('#FFFFFF', 0.8),
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isDark
                ? '0 24px 60px rgba(0,0,0,0.55)'
                : '0 24px 60px rgba(79, 70, 229, 0.12)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? alpha('#0E1730', 0.6) : '#FFFFFF',
            borderRadius: 12,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${alpha('#4F46E5', isDark ? 0.22 : 0.1)}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: alpha('#4F46E5', isDark ? 0.2 : 0.08) },
        },
      },
    },
  };
};

const AIPortfolio = () => {
  // ---- Dark mode state (defaults to light as requested) ----
  const [mode, setMode] = useState('light');
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)'); // not auto-applying, just available if needed
  const muiTheme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi! I'm Dharshina's AI assistant powered by Groq. Ask me anything about my experience, skills, projects, or education!" }
  ]);
  const [input, setInput] = useState('');
  const apiKey = process.env.REACT_APP_API_KEY;
  const [showApiInput, setShowApiInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const portfolioData = {
    name: "Dharshina Venkatesan",
    title: "Software Testing & Automation Engineer",
    location: "United States",
    phone: "908-304-1186",
    email: "dharshinavenkatesan17@gmail.com",
    linkedin: "https://www.linkedin.com/in/dharshina/",
    github: "https://github.com/dharshina",
    summary: "Motivated Software Testing and Automation Engineer with 2+ years of experience in Manual and Automation testing, Regression, User Acceptance Testing (UAT) and test management. Skilled in designing and maintaining automated testing frameworks, developing test scripts using Selenium and TestNG, and integrating tests within CI/CD pipelines. Experienced in API testing with Postman and SOAP, executing functional, regression, and performance test cases. Adept at collaborating with developers in Agile environments to ensure software quality, security, and performance standards.",
    education: {
      degree: "Master of Computer Science",
      school: "Illinois Institute of Technology",
      location: "Chicago, Illinois",
      period: "Aug 2022 - May 2024",
      clubs: ["Association of Computer Machinery (ACM)", "Women in STEM (WiSTEM)", "TechNews", "Library Student Advisory Group"]
    },
    skills: {
      testing: ["Selenium WebDriver", "UFT", "JMeter", "JUnit", "TestNG", "SoapUI", "Postman"],
      expertise: ["Manual Testing", "Automation Testing", "API Testing (REST/SOAP)", "Functional Testing", "Regression Testing", "Smoke Testing", "Mobile Testing", "Database Testing", "Usability Testing"],
      cicd: ["Jenkins", "JIRA"],
      methodologies: ["Agile (Scrum, Kanban)", "Waterfall", "SDLC", "STLC"],
      databases: ["MySQL", "Oracle", "Azure SQL"],
      languages: ["Java", "Python", "SQL"],
      tools: ["Git", "Microsoft Office Suite", "Visio", "Slack"]
    },
    experience: [
      {
        role: "Software Engineer",
        company: "Software Architects LLC",
        location: "Chicago, United States",
        period: "Jan 2025 - Oct 2025",
        responsibilities: [
          "Partnered with product and development teams to validate feature requirements, ensuring QA checkpoints were embedded into customer-facing product enhancements.",
          "Conducted data analysis using Google Analytics, Tableau, and Excel to identify patterns and improve product usability and adoption.",
          "Authored process documentation and escalation workflows, driving quality improvements and reducing resolution time across customer-facing teams.",
        ]
      },

      {
        role: "Test Automation Engineer",
        company: "Accenture",
        location: "Chennai, India",
        period: "Jun 2020 - Jul 2022",
        responsibilities: [
          "Designed and automated 200+ test cases with Selenium WebDriver and Cypress, improving regression coverage and reducing manual testing effort by 30%.",
          "Performed REST API and microservices validation using Postman, SOAP UI, and Swagger, ensuring seamless backend integrations and service reliability",
          "Integrated automated test scripts into CI/CD pipelines with Jenkins and GitHub Actions, enabling faster, more reliable deployments.",
          "Conducted performance and load testing with JMeter, providing baseline metrics on system stability under peak conditions.",
          "Collaborated in Agile ceremonies (sprint planning, reviews, retrospectives) to align QA priorities with development timelines.",
          "Tracked and reported quality metrics (defect density, test execution coverage, automation pass rates) to stakeholders, enabling data-driven improvements in QA processes.",
          "Improved SQL queries for test data retrieval, reducing execution times by 60–70% and enhancing efficiency in database testing."
        ]
      }
    ],
    projects: [

      {
        name: "Model-Based Testing of Automated Retail Kiosk",
        description: "Designed an EFSM model to represent system states and transitions for an automated retail kiosk, enabling structured test case generation",
        tech: ["Java", "EFSM", "Model-Based Testing"],
        highlights: ["Designed an EFSM model to represent system states and transitions for an automated retail kiosk, enabling structured and accurate test case generation.", "Developed Java-based drivers to execute model-based tests covering ghost transitions, default behaviors, and variable-based conditions. Achieved high test coverage through multiple-condition testing, transition pair validation, and a comprehensive automated test suite"]
      },
      {
        name: "Cross-Browser Testing for E-commerce Platform",
        description: "Implemented automated test scripts using Selenium WebDriver and TestNG to validate key functionalities",
        tech: ["Selenium WebDriver", "TestNG", "Selenium Grid"],
        highlights: ["Developed Java-based automation frameworks in Selenium WebDriver and TestNG, writing reusable scripts and regression test cases for web-based applications to validate employee login, leave application submission, payroll calculations.", "Performed cross-browser testing on Chrome, Firefox, and Edge using Selenium Grid to ensure consistent application behavior. Captured detailed screenshots and failure logs through custom utility functions to generate test execution reports for debugging"]
      }
    ]
  };

  const highlightMetrics = [
    { label: 'Years in QA', value: '2+ yrs', icon: Work },
    { label: 'Automation Tools', value: `${portfolioData.skills.testing.length} tools`, icon: Code },
    { label: 'Key Projects', value: `${portfolioData.projects.length} case studies`, icon: EmojiEvents }
  ];

  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
      <Box
        sx={{
          width: 48, height: 48, borderRadius: 12,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main',
        }}
      >
        <Icon />
      </Box>
      <Box>
        <Typography variant="h4">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        )}
      </Box>
    </Box>
  );

  const getSystemContext = () => {
    return `You are an AI assistant for Dharshina Venkatesan's portfolio. Your role is to answer questions about her professional background in a friendly, conversational manner and in short 2 line response.

PROFILE INFORMATION:
Name: ${portfolioData.name}
Title: ${portfolioData.title}
Location: ${portfolioData.location}
Contact: ${portfolioData.email}, ${portfolioData.phone}

SUMMARY:
${portfolioData.summary}

EDUCATION:
${portfolioData.education.degree} from ${portfolioData.education.school}, ${portfolioData.education.location} (${portfolioData.education.period})
Active in clubs: ${portfolioData.education.clubs.join(', ')}

SKILLS:
- Testing Tools: ${portfolioData.skills.testing.join(', ')}
- Testing Expertise: ${portfolioData.skills.expertise.join(', ')}
- Languages: ${portfolioData.skills.languages.join(', ')}
- CI/CD Tools: ${portfolioData.skills.cicd.join(', ')}
- Databases: ${portfolioData.skills.databases.join(', ')}
- Methodologies: ${portfolioData.skills.methodologies.join(', ')}

WORK EXPERIENCE:
1. ${portfolioData.experience[0].role} at ${portfolioData.experience[0].company} (${portfolioData.experience[0].period}):
   ${portfolioData.experience[0].responsibilities.join('\n   ')}

2. ${portfolioData.experience[1].role} at ${portfolioData.experience[1].company} (${portfolioData.experience[1].period}):
   ${portfolioData.experience[1].responsibilities.join('\n   ')}

PROJECTS:
1. ${portfolioData.projects[0].name}: ${portfolioData.projects[0].description}
   Technologies: ${portfolioData.projects[0].tech.join(', ')}
   
2. ${portfolioData.projects[1].name}: ${portfolioData.projects[1].description}
   Technologies: ${portfolioData.projects[1].tech.join(', ')}

Answer questions naturally and conversationally. Keep responses concise but informative. Always speak in first person as if you are Dharshina's representative.`;
  };

  const [open, setOpen] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioData.email);
      setOpen(true);
    } catch (err) {
      console.error("Failed to copy email: ", err);
    }
  };

  const callGroqAPI = async (userMessage) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: getSystemContext() },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API Error:', error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Please enter your Groq API key first using the key icon above.' }]);
      return;
    }
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await callGroqAPI(input);
      setMessages(prev => [...prev, { type: 'bot', text: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: `Sorry, I encountered an error: ${error.message}. Please check your API key and try again.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiInput(false);
      setMessages([{
        type: 'bot',
        text: "Great! API key configured. I'm now powered by Groq's Llama 3.3 70B model. Ask me anything about Dharshina's experience, skills, or projects!"
      }]);
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }}>
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{
            backdropFilter: 'blur(18px)',
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.85),
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
            <Stack direction="row" spacing={1.5}>
              <Box>
                <Typography variant="h6" component="h1" color="primary" fontWeight={800}>
                  {portfolioData.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {portfolioData.title}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
                  <IconButton
                    onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                    size="medium"
                    sx={{
                      border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.25)}`,
                      bgcolor: alpha(muiTheme.palette.primary.main, 0.06),
                    }}
                  >
                    {mode === 'light' ? <DarkMode /> : <LightMode />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">


              {/* 🔽 New Download Resume Button */}
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Work />}
                href="https://drive.google.com/file/d/1CUIdASpWGzWhPLaIz_4nZfqTZnfw1k3P/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Resume
              </Button>
            </Stack>

          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Slide in timeout={600} direction="up">
                <Box>
                  <Avatar
                    src="https://media.licdn.com/dms/image/v2/D5635AQEcDJYPfFYV5Q/profile-framedphoto-shrink_400_400/B56ZezSAbHHQAs-/0/1751059531731?e=1762999200&v=beta&t=wxZEyMI3YlpJlztCwl9o3D3OGhKibN-ojdcmDiEd_yc"
                    alt="User Avatar"
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 3,
                      boxShadow:
                        '0 0 0 4px rgba(255,255,255,0.9), 0 0 24px rgba(79,70,229,0.45)',
                    }}
                  >
                    DV
                  </Avatar>

                  <Typography variant="h3" gutterBottom>{portfolioData.name}</Typography>
                  <Typography variant="h5" color="primary" gutterBottom>{portfolioData.title}</Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {portfolioData.summary}
                  </Typography>

                  <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
                    <Chip icon={<LocationOn />} label={portfolioData.location} size="small" />
                    <Chip icon={<Phone />} label={portfolioData.phone} size="small" />
                    <Chip icon={<Email />} label={portfolioData.email} size="small" />
                  </Stack>

                  <Stack direction="row" spacing={1.5} mt={3} flexWrap="wrap">
                    {[
                      { icon: <Work />, label: 'Years in QA', val: '2+ yrs' },
                      { icon: <Code />, label: 'Automation Tools', val: `${portfolioData.skills.testing.length}` },
                      { icon: <EmojiEvents />, label: 'Key Projects', val: `${portfolioData.projects.length}` },
                    ].map((m, i) => (
                      <Paper key={i} sx={{ px: 2, py: 1.25, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {m.icon}
                        <Typography variant="body2" color="text.secondary">{m.label} •</Typography>
                        <Typography variant="subtitle2" fontWeight={800}>{m.val}</Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Slide>
            </Grid>

            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <Fade in timeout={700}>
                <Paper elevation={3} sx={{ height: 520, width: 1000, display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: (theme) => alpha(theme.palette.primary.light, 0.18),
                      borderBottom: 1,
                      borderColor: 'divider',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SmartToy color="primary" />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={800}>
                          Dharshina's AI assistant
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Powered by Groq Llama 3.3 70B
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      overflowY: 'auto',
                      p: 2,
                      bgcolor: (theme) => alpha(theme.palette.background.default, 0.35),
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}
                  >
                    {messages.map((msg, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          gap: 1,
                          justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {msg.type === 'bot' && (
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            <SmartToy sx={{ fontSize: 20 }} />
                          </Avatar>
                        )}
                        <Paper
                          sx={{
                            p: 1.5,
                            maxWidth: '75%',
                            bgcolor: msg.type === 'user' ? 'primary.main' : 'background.paper',
                            color: msg.type === 'user' ? 'white' : 'text.primary',
                            borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            boxShadow: msg.type === 'user'
                              ? '0 6px 18px rgba(79,70,229,0.35)'
                              : '0 6px 14px rgba(0,0,0,0.08)',
                            whiteSpace: 'pre-line'
                          }}
                        >
                          <Typography variant="body2">{msg.text}</Typography>
                        </Paper>
                        {msg.type === 'user' && (
                          <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                            <Person sx={{ fontSize: 20 }} />
                          </Avatar>
                        )}
                      </Box>
                    ))}
                    {isLoading && (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <SmartToy sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Paper sx={{ p: 1.5 }}>
                          <CircularProgress size={20} />
                        </Paper>
                      </Box>
                    )}
                    <div ref={messagesEndRef} />
                  </Box>

                  {/* Input */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Ask me anything..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleSend} disabled={isLoading} color="primary">
                              <Send />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>

        {/* Education Section */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Fade in timeout={700}>
            <Box>
              <SectionHeader icon={School} title="Education" />
              <Card>
                <CardContent>
                  <Box sx={{ borderLeft: 4, borderColor: 'primary.main', pl: 3 }}>
                    <Typography variant="h6" fontWeight={800}>
                      {portfolioData.education.degree}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      {portfolioData.education.school}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {portfolioData.education.location} • {portfolioData.education.period}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Clubs:</strong> {portfolioData.education.clubs.join(', ')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        </Container>

        {/* Skills Section */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Fade in timeout={800}>
            <Box>
              <SectionHeader icon={Code} title="Technical Skills" />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight={800}>
                        Testing Tools & Frameworks
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {portfolioData.skills.testing.map((skill, i) => (
                          <Chip key={i} label={skill} color="primary" variant="outlined" size="small" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight={800}>
                        Programming Languages
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {portfolioData.skills.languages.map((skill, i) => (
                          <Chip key={i} label={skill} color="secondary" variant="outlined" size="small" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight={800}>
                        Testing Expertise
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {portfolioData.skills.expertise.slice(0, 6).map((skill, i) => (
                          <Chip key={i} label={skill} color="success" variant="outlined" size="small" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight={800}>
                        Databases & Tools
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {[...portfolioData.skills.databases, ...portfolioData.skills.cicd].map((skill, i) => (
                          <Chip key={i} label={skill} color="info" variant="outlined" size="small" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Container>

        {/* Experience Section */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Fade in timeout={900}>
            <Box>
              <SectionHeader icon={Work} title="Professional Experience" />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {portfolioData.experience.map((exp, i) => (
                  <Card key={i}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" fontWeight={800}>
                            {exp.role}
                          </Typography>
                          <Typography variant="subtitle1" color="primary">
                            {exp.company}
                          </Typography>
                        </Box>
                        <Chip label={exp.period} variant="outlined" />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {exp.location}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        {exp.responsibilities.map((resp, j) => (
                          <Typography component="li" key={j} variant="body2" paragraph>
                            {resp}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Fade>
        </Container>

        {/* Projects Section */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Fade in timeout={1000}>
            <Box>
              <SectionHeader icon={EmojiEvents} title="Featured Projects" />
              <Grid container spacing={3}>
                {portfolioData.projects.map((project, i) => (
                  <Grid item xs={12} md={6} key={i}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={800} gutterBottom>
                          {project.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {project.description}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                          Technologies:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {project.tech.map((t, j) => (
                            <Chip key={j} label={t} size="small" color="primary" variant="filled" />
                          ))}
                        </Box>
                        <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                          Key Highlights:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                          {project.highlights.map((h, j) => (
                            <Typography component="li" key={j} variant="body2" color="text.secondary">
                              {h}
                            </Typography>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        </Container>

        {/* Contact Section */}
        <Container maxWidth="lg" sx={{ py: 6, pb: 12 }}>
          <Fade in timeout={1100}>
            <Box>
              <SectionHeader icon={Email} title="Get In Touch" />
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Button variant="outlined" startIcon={<ContentCopy />} onClick={handleCopy}>
                      Email Me
                    </Button>
                    <Snackbar
                      open={open}
                      autoHideDuration={2000}
                      onClose={() => setOpen(false)}
                      message="Email copied to clipboard!"
                      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    />
                    <Button variant="outlined" startIcon={<LinkedIn />} href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </Button>
                    <Button variant="outlined" startIcon={<GitHub />} href={portfolioData.github} size="large" target="_blank" rel="noopener noreferrer">
                      GitHub
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AIPortfolio;


