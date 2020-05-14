import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "firebase";
import Config from "./firebase/config";

import ContactList from "./components/ContactList";
import ContactItem from "./components/ContactItem";
import { addContact, removeContact } from "./states/action";
import "./css/App.css";

class App extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(Config);

    this.state = {
      name: "",
      phone: "",
      email: ''
    };
  }

  ambilDataDariServerAPI = () => {                // fungsi untuk mengambil data dari API dengan penambahan sort dan order
    let ref = firebase.database().ref("/");
    ref.on("value", snapshot => {
        const state = snapshot.val();
        this.setState(state);   
    })
}

  simpanDataKeServerAPI = () => {
    firebase.database().ref("/").set(this.state);
}

componentDidMount() {       // komponen untuk mengecek ketika compnent telah di-mount-ing, maka panggil API
  this.ambilDataDariServerAPI()  // ambil data dari server API lokal
}

componentDidUpdate(prevProps, prevState){
  if (prevState !== this.state){
      this.simpanDataKeServerAPI();
  }
}

handleHapusContact = (idContact) => {        // fungsi yang meng-handle button action hapus data
  const {listContact} = this.state;
  const newState = listContact.filter(data => {
      return data.uid !== ContactList;
  })
  this.setState({listContact: newState})
}


handleTombolSimpan = (event) => {            // fungsi untuk meng-handle tombol simpan
  let name = this.refs.name.value;
  let phone = this.refs.phone.value;
  let email = this.refs.email.value;
  let uid = this.refs.uid.value;

  if(uid && name && phone && email){
    const {listContact} = this.state;
    const indeksContact = listContact.findIndex(data => {
      return data.uid === uid;
    });
    listContact[indeksContact].name = name;
    listContact[indeksContact].phone = phone;
    listContact[indeksContact].email = email;
    this.setState({listContact});
  
  } else if(name && phone && email){
    const uid = new Date().getTime().toString();
    const {listContact} = this.state;
    listContact.push({ uid, phone , email });
    this.setState({listContact});
  }
    this.refs.name.value = "";
    this.refs.phone.value = "";
    this.refs.email.value = "";
    this.refs.uid.value = "";
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
            ref = "name"
            value={name}
            onChange={event => this.setState({ name: event.target.value })}
            className="App__input"
            placeholder="Name"
          />
          <br />
          <input
            type="text"
            ref = "phone"
            value={phone}
            onChange={event => this.setState({ phone: event.target.value })}
            className="App__input"
            placeholder="Phone"
          />
          <br />
          <input
            type="text"
            ref = "email"
            value={email}
            onChange={event => this.setState({ email: event.target.value })}
            className="App__input"
            placeholder="Email"
          />
          <br />
          <input type="hidden" name="uid" ref="uid"></input>
          <button type="submit" 
            // type="button"
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
            onClick={this.handleTombolSimpan}
          >
            Add New Contact
          </button>
        </div>
        <ContactList>
          {contacts.map(contact => {
            return (
              <ContactItem
                key={contact.uid}
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