import React, { useState, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import Delete from "@material-ui/icons/Delete";
import {
  AppBar,
  Button,
  Checkbox,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { auth, db } from "./firebase";

export function App(props) {
  const [user, setUser] = useState(null);
  const [queue, setQueue] = useState([]);
  const [newQueue, setNewQueue] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
        console.log(u.uid);
        db.collection("users")
          .doc(u.uid)
          .get()
          .then(s => {
            console.log(s.data());
            if (s.data().admin) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          });
      } else {
        props.history.push("/");
      }
    });

    return unsubscribe;
  }, [props.history]);

  useEffect(() => {
    db.collection("queue")
      .orderBy("time")
      .onSnapshot(snapshot => {
        const updatedQueue = snapshot.docs.map(d => {
          const data = d.data();
          data.id = d.id;
          return data;
        });
        console.log(updatedQueue);
        setQueue(updatedQueue);
      });
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const addQueue = () => {
    db.collection("queue")
      .add({ time: new Date(), name: newQueue, user_id: user.uid })
      .then(r => {
        setNewQueue("");
      });
  };

  const deleteQueue = id => {
    db.collection("queue")
      .doc(id)
      .delete();
  };

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginLeft: "30px" }}
          >
            My App
          </Typography>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <div
        style={{ display: "flex", justifyContent: "center", paddingTop: 30 }}
      >
        <Paper style={{ padding: 20, maxWidth: 500, width: "100%" }}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 40 }}
          >
            <TextField
              fullWidth
              label="Sign Up for the Queue"
              value={newQueue}
              onChange={e => {
                setNewQueue(e.target.value);
              }}
            />
            <div>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 15 }}
                onClick={addQueue}
              >
                ADD
              </Button>
            </div>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Done</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queue.map((q, i) => {
                return (
                  <TableRow key={q.id}>
                    <TableCell size="small">
                      <Checkbox
                        checked={false}
                        onChange={() => {
                          deleteQueue(q.id);
                        }}
                        disabled={!(user.uid === q.user_id || isAdmin)}
                      />
                    </TableCell>
                    <TableCell size="small">{i + 1}</TableCell>
                    <TableCell size="small">{q.name}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </div>
  );
}
