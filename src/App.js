
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import TodoList from './blockchain/build/contracts/TodoList.json'

const App = () => {
  const [account, setAccount] = useState();
  const [todoList, setTodoList] = useState([]);

  const load = async () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);

    const contractInstance = new web3.eth.Contract(TodoList.abi, '0x8Aa73FD61F8BDEdBd7bd8484657545936bE1E77d');


    const counter = await contractInstance.methods.taskCount().call();

    const tempList = []
    for (var i = 1; i <= counter; i++) {
      const todo = await contractInstance.methods.tasks(i).call();
      tempList.push(todo)
    }
    setTodoList(tempList)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      your account is {account}
      <br />
      <h2>TodoList</h2>
      <ul>
        {todoList.map(item => (
          <li>
            {item.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
