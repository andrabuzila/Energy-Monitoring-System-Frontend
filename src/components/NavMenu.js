import React, { useContext } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { AppContext } from '../App';

const NavMenu =()=> {
  const {isLoggedIn, setIsLoggedIn, setUserId, setUsers, setDevices, userRole} = useContext(AppContext)

  const clickLogout = () => {
    setIsLoggedIn(false)
    setUserId(0)
    setUsers(null)
    setDevices(null)
  }
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm background border-bottom box-shadow mb-3" container light>
          <NavbarBrand tag={Link} to="/">my_project</NavbarBrand>
          <NavbarToggler className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" >
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-white" to="/">Home</NavLink>
              </NavItem>
              {
                isLoggedIn && userRole === 'administrator'  &&
                  <NavItem>
                  <NavLink tag={Link} className="text-white" to="/admin-page-devices">Personal Devices</NavLink>
                </NavItem>
              }
              {
                isLoggedIn && userRole === 'administrator' && 
                <NavItem>
                    <NavLink tag={Link} className="text-white" to="/admin-page">Users and Devices</NavLink>
                  </NavItem>
              }
              {
                isLoggedIn && userRole === 'user' &&
                  <NavItem>
                    <NavLink tag={Link} className="text-white" to="/user-dashboard">Devices</NavLink>
                  </NavItem>
              }
              {
                isLoggedIn && 
                <NavItem>
                  <NavLink tag={Link} className="text-white" to="/monitored-data">Monitored Data</NavLink>
                </NavItem>
              }
              {
                isLoggedIn && 
                <NavItem>
                  <NavLink tag={Link} className="text-white" to="/chat-room">Chat Room</NavLink>
                </NavItem>
              }
              {
                isLoggedIn ? (
                  <NavItem>
                    <NavLink tag={Link} className="text-white" to="/" onClick={clickLogout}>Logout</NavLink>
                  </NavItem>
                ) : (
                  <NavItem>
                    <NavLink tag={Link} className="text-white" to="/login">Login</NavLink>
                  </NavItem>
                )
              }
            </ul>
          </Collapse>
        </Navbar>
      </header>
    );
}

export default NavMenu;
