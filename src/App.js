
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import TodoList from './blockchain/build/contracts/TodoList.json'

const App = () => {
  const [account, setAccount] = useState();
  // const [contactList, setContactList] = useState();
  // const [contacts, setContacts] = useState([]);

  const loadContract = () => {
    console.log(TodoList)
  }

  const load = async () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);
    // // Instantiate smart contract using ABI and address.
    // const contactList = new web3.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);
    // // set contact list to state variable.
    // setContactList(contactList);
    // // Then we get total number of contacts for iteration
    // const counter = await contactList.methods.count().call();
    // // iterate through the amount of time of counter
    // for (var i = 1; i <= counter; i++) {
    //     // call the contacts method to get that particular contact from smart contract
    //     const contact = await contactList.methods.contacts(i).call();
    //     // add recently fetched contact to state variable.
    //     setContacts((contacts) => [...contacts, contact]);
    // }
  }

  useEffect(() => {
    load()
    loadContract()
  }, [])

  return (
    <div>
      your account is {account}
    </div>
  );
}

export default App;
