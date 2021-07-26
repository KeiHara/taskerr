import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Avatar, Box, Drawer, AppBar, Toolbar, List, Typography, CssBaseline, Divider, IconButton, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { useAuth } from '../../contexts/AuthContext';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';

const drawerWidth = 209;

//custom style and functionality for drawer 
const useStyles = makeStyles( theme => ({ 
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: theme.palette.primary.mainGradient
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    background: theme.palette.background.defaultSecondary,
    border:0,
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    background: theme.palette.background.defaultSecondary,
    border:0,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    minHeight: '100vh',
    flexGrow: 1,
    padding: theme.spacing(3),
    background: theme.palette.background.defaultPrimary
  },
  avatar: {
    marginLeft: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },

  balance: {
    marginRight: theme.spacing(2),
  }

}));

export default function Nav({ children }) {
  const classes = useStyles();
  const history = useHistory()

  //drawer state
  const [open, setOpen] = React.useState(false);

  //signout function from context
  const { signOut } = useAuth()

  //get current user from context
  const { currentUser } = useAuth()
  //get user profile from context
  const { user } = useAuth()
  const balance = !user ? 0 : user.balance

  //list of links for top
  const menuTopItems = [
    {
      text: 'My Tasks',
      icon:  <FormatListBulletedIcon />,
      function: () => {
        history.push('/')
      }
    },
    {
      text: 'Add Task',
      icon: <PlaylistAddIcon />,
      function: () => {
        history.push('/addtask')
      }
    },
    {
      text: 'Received Tasks',
      icon: <MoveToInboxIcon />,
      function: () => {
        history.push('/received')
      }
    },
  ]

  // list of links for bottom
  const menuBottomItems = [
    {
      text: 'Balance',
      icon: <CreditCardIcon />,
      function: () => {
        history.push('/balance')
      }
    },
    {
      text: 'Logout',
      icon: <ExitToAppIcon />,
      function: () => {
        signOut()
      }
    },
  ]

  // function for change drawer's state
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  

  return (
    // Using template from material-ui website so idk wut in the f wut these means but its cool so leave it
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
        })}      >
      <Box color='primary.main'></Box>
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <ArrowForwardIosIcon fontSize='small'/>
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Taskerr
          </Typography>
          <Typography
            className={classes.balance}
          >
            Balance: {balance}
          </Typography>
          <Typography>
            {currentUser.displayName}
          </Typography>
          <Avatar src={currentUser.photoURL} className={classes.avatar} />
        </Toolbar>
      </AppBar>
      
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose} >
              <ArrowBackIosIcon fontSize="small"/>
            </IconButton>
          </div>
          <Divider />
          <List>
            {menuTopItems.map(item => (
              <ListItem
                  button
                  key={item.text}
                  onClick={() => item.function()}
              >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Box mt="auto">
            <Divider />
            <List>
              {menuBottomItems.map(item => (
              <ListItem
                  button
                  key={item.text}
                  onClick={() => item.function()}
              >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
              </ListItem>
            ))}
            </List>
          </Box>
        </Drawer>
      
      {/* main content goes inside here */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
          {children}  
      </main>
    </div>
  );
}