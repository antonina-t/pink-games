import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Home from "./Home";
import Memory from "./memory";
import Snake from "./snake";
import Minesweeper from "./minesweeper";
import "./App.css";

const App = () => (
  <Router>
    <Navbar collapseOnSelect expand="sm" bg="light" variant="light">
      <Link to="/" className="navbar-brand">
        Games
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Link to="/memory" className="nav-link">
            Memory
          </Link>
          <Link to="/snake" className="nav-link">
            Snake
          </Link>
          <Link to="/minesweeper" className="nav-link">
            Minesweeper
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/memory" component={Memory} />
      <Route path="/snake" component={Snake} />
      <Route path="/minesweeper" component={Minesweeper} />
    </Switch>
  </Router>
);

export default App;
