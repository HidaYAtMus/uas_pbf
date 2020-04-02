import React, { Component } from "react";
import { connect } from "react-redux";

import ContactList from "./components/ContactList";
import ContactItem from "./components/ContactItem";
import { addContact, removeContact } from "./states/action";
import "./css/App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      phone: "",
      email: ''
    };
  }

  render() {
    const { name, phone, email } = this.state;
    // The state from store passed as props
    const { contacts, addNewContact, removeExistingContact } = this.props;

    return (
      <div className="App">
        <div className="App__form">
        <h2>Add Friend</h2>
          <input
            type="text"
            value={name}
            onChange={event => this.setState({ name: event.target.value })}
            className="App__input"
            placeholder="Name"
          />
          <br />
          <input
            type="text"
            value={phone}
            onChange={event => this.setState({ phone: event.target.value })}
            className="App__input"
            placeholder="Phone"
          />
          <br />
          <input
            type="text"
            value={email}
            onChange={event => this.setState({ email: event.target.value })}
            className="App__input"
            placeholder="Email"
          />
          <br />
          <button
            type="button"
            onClick={() => {
              if (!name || !phone) {
                alert("Field cannot be empty !");
                
              } else if (!name || !email){
                alert ("Field cannot be empty !");
                
              } else if (!phone || !email){
                alert ("Field cannot be empty !"); 
                return;
              }

              this.setState({ name: "", phone: "", email: "" });
              addNewContact({ name, phone, email });
            }}
            className="App__button"
          >
            Add New Contact
          </button>
        </div>
        <ContactList>
          {contacts.map(contact => {
            return (
              <ContactItem
                key={contact.id}
                name={contact.name}
                phone={contact.phone}
                email={contact.email}
                onClickDelete={() => removeExistingContact(contact.id)}
              />
            );
          })}
        </ContactList>
      </div>
    );
  }
}

// Get your state and passing to your App component as props
const mapStateToProps = ({ contacts }) => ({
  contacts
});

// Create functionality which need to use dispatch
const mapDispatchToProps = dispatch => ({
  addNewContact: contact => {
    dispatch(addContact(contact));
  },
  removeExistingContact: contactID => {
    dispatch(removeContact(contactID));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);