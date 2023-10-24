import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserList.css"; // Import the CSS file

function UserList() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [editUser, setEditUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    // Fetch users from the backend API if authenticated
    if (authenticated) {
      axios.get("http://localhost:8000/userinfo").then((response) => {
        setUsers(response.data);
      });
    }
  }, [authenticated]);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleLoginInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const addUser = () => {
    // Send a POST request to create a new user if authenticated
    if (authenticated) {
      axios.post("http://localhost:8000/userinfo", newUser).then((response) => {
        setUsers([...users, response.data]);
        setNewUser({
          fname: "",
          lname: "",
          email: "",
          password: "",
        });
      });
    }
  };

  const deleteUser = (id) => {
    // Send a DELETE request to delete a user if authenticated
    if (authenticated) {
      axios.delete(`http://localhost:8000/userinfo/${id}`).then(() => {
        setUsers(users.filter((user) => user._id !== id));
      });
    }
  };

  const editUserHandler = (user) => {
    // Set the user to edit and populate the input fields
    setEditUser(user);
    setNewUser({
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      password: user.password,
    });
  };

  const saveEditedUser = () => {
    // Send a PUT request to update a user if authenticated
    if (authenticated && editUser) {
      axios
        .put(`http://localhost:8000/userinfo/${editUser._id}`, newUser)
        .then((response) => {
          // Update the user in the local state
          const updatedUsers = users.map((user) =>
            user._id === editUser._id ? response.data : user
          );
          setUsers(updatedUsers);

          // Clear edit mode and input fields
          setEditUser(null);
          setNewUser({
            fname: "",
            lname: "",
            email: "",
            password: "",
          });
        });
    }
  };

  const login = () => {
    // Authenticate when username and password are "admin"
    if (loginData.username === "admin" && loginData.password === "admin") {
      setAuthenticated(true);
    }
  };

  const logout = () => {
    // Clear authentication
    setAuthenticated(false);
    setUsers([]);
  };

  return (
    <div className="user-list-container">
      {!authenticated ? (
        <div>
          <h2>Login</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={loginData.username}
            onChange={handleLoginInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginInputChange}
          />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <h1>User List</h1>
          <button onClick={logout}>Logout</button>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.fname} {user.lname} - {user.email}
                <button onClick={() => deleteUser(user._id)}>Delete</button>
                <button onClick={() => editUserHandler(user)}>Edit</button>
              </li>
            ))}
          </ul>
          {editUser ? (
            <div>
              <h2>Edit User</h2>
              <input
                type="text"
                name="fname"
                placeholder="First Name"
                value={newUser.fname}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="lname"
                placeholder="Last Name"
                value={newUser.lname}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleInputChange}
              />
              <button onClick={saveEditedUser}>Save</button>
            </div>
          ) : (
            <div>
              <h2>Add User</h2>
              <input
                type="text"
                name="fname"
                placeholder="First Name"
                value={newUser.fname}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="lname"
                placeholder="Last Name"
                value={newUser.lname}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleInputChange}
              />
              <button onClick={addUser}>Add</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserList;
