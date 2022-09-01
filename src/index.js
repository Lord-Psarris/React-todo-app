/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import ReactDOM from 'react-dom';
import { hop } from "@onehop/client";
import './index.css';

class Header extends React.Component {

    toggleTheme(theme) {
        localStorage.setItem("theme", theme);
        document.body.classList.toggle("dark");
        document.getElementsByClassName('toggle-day')[0].classList.toggle('active')
        document.getElementsByClassName('toggle-night')[0].classList.toggle('active')

    }

    render() {
        return (
            <div class="header">
                <h1>Todo</h1>
                <div class="toggle-icons">
                    <a href="#" onClick={() => this.toggleTheme('light')} class="toggle-day">
                        <img src={require("./images/icon-sun.svg").default} alt="light" />
                    </a>

                    <a href="#" onClick={() => this.toggleTheme('dark')} class="toggle-night">
                        <img src={require("./images/icon-moon.svg").default} alt="light" />
                    </a>
                </div>
            </div>
        )
    }
}

function AddTodo(props) {
    return (
        <div class="add-todo">
            <div class="box">
                <div class="check">
                    <input type="checkbox" name="" id="main-checkbox" />
                    <label for="main-checkbox" class="check-label" >
                        <img src={require("./images/icon-check.svg").default} alt="check-mark" class="check-mark" />
                    </label>
                </div>
                <input onKeyDown={props.addNewTodoItem} type="text" placeholder="Create a new todo" />
            </div>
        </div >
    )
}

class TodoWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoItems: this.props.todoItems
        }
    }

    handleSelectAll(event) {
        document.querySelector('.switch-tab > a.active').classList.remove('active')
        event.target.classList.add('active')
        var todoItemsList = this.props.todoItems

        this.setState({ todoItems: todoItemsList })

    }

    handleSelectActive(event) {
        document.querySelector('.switch-tab > a.active').classList.remove('active')
        event.target.classList.add('active')

        var todoItemsList = this.props.todoItems
        var newTodoItemsList = []

        for (let i = 0; i < todoItemsList.length; i++) {
            let currentItem = todoItemsList[i]
            if (currentItem.checked === false) {
                newTodoItemsList.push(currentItem)
            }
        }

        this.setState({ todoItems: newTodoItemsList })
    }

    handleSelectCompleted(event) {
        document.querySelector('.switch-tab > a.active').classList.remove('active')
        event.target.classList.add('active')

        var todoItemsList = this.props.todoItems
        var newTodoItemsList = []

        for (let i = 0; i < todoItemsList.length; i++) {
            let currentItem = todoItemsList[i]
            if (currentItem.checked === true) {
                newTodoItemsList.push(currentItem)
            }
        }

        this.setState({ todoItems: newTodoItemsList })
    }

    render() {
        const todoItemsList = this.state.todoItems
        const checkedItems = this.props.checkedItems
        const todoItems = todoItemsList.map((todoItem, step) => {
            return (<TodoItem key={todoItem.id} itemId={todoItem.id} itemText={todoItem.itemText}
                deleteItem={this.props.deleteItem} checkItem={this.props.checkItem} itemChecked={todoItem.checked} />);
        })
        return (
            <div class="todos">
                <div id="todo-items">
                    {todoItems}
                    <TodoOptions
                        clearCompleted={this.props.clearCompleted}
                        selectOptionsAll={(Event) => this.handleSelectAll(Event)}
                        selectOptionsActive={(Event) => this.handleSelectActive(Event)}
                        selectOptionsCompleted={(Event) => this.handleSelectCompleted(Event)} checkedItems={checkedItems} />
                </div>
            </div>
        )
    }
}

class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: ''
        }
    }

    render() {
        const itemId = this.props.itemId
        const itemText = this.props.itemText
        const isChecked = this.props.itemChecked

        if (isChecked) {
            return (
                <div id={itemId}>
                    <div class="box">
                        <div class="check">
                            <input checked data-id={itemId} onChange={this.props.checkItem} type="checkbox" name="" id={"checkbox-" + itemId} class="checkbox" />
                            <label for={"checkbox-" + itemId} class="check-label">
                                <img src={require("./images/icon-check.svg").default} alt="check-mark" class="check-mark" />
                            </label>
                        </div>

                        <p class={"checked checkbox-" + itemId}>{itemText}</p>
                        <div data-id={itemId} class="close" onClick={this.props.deleteItem}>
                            <img src={require("./images/icon-cross.svg").default} alt="cross" />
                        </div>
                    </div>
                    <span class="hr"></span>
                </div>
            )
        } else {
            return (
                <div id={itemId}>
                    <div class="box">
                        <div class="check">
                            <input data-id={itemId} onChange={this.props.checkItem} type="checkbox" name="" id={"checkbox-" + itemId} class="checkbox" />
                            <label for={"checkbox-" + itemId} class="check-label">
                                <img src={require("./images/icon-check.svg").default} alt="check-mark" class="check-mark" />
                            </label>
                        </div>

                        <p class={"checkbox-" + itemId}>{itemText}</p>
                        <div data-id={itemId} class="close" onClick={this.props.deleteItem}>
                            <img src={require("./images/icon-cross.svg").default} alt="cross" />
                        </div>
                    </div>
                    <span class="hr"></span>
                </div>
            )
        }

    }
}

function TodoOptions(props) {
    return (
        <div class="others">
            <span>
                <i id="count">{props.checkedItems}</i>
                &nbsp;items left
            </span>
            <p class="switch-tab">
                <a href="#" class="active" onClick={props.selectOptionsAll}>All</a>
                <a href="#" onClick={props.selectOptionsActive}>Active</a>
                <a href="#" onClick={props.selectOptionsCompleted}>Completed</a>
            </p>
            <a href="#" class="clear" onClick={props.clearCompleted}>Clear Completed</a>
        </div>
    )
}

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoItems: [],
            todoItemCount: 0,
            checkedTodoItemsCount: 0,
        }
    }

    handleClearCompleted() {
        var checkedItemsCount = this.state.checkedTodoItemsCount
        var todoItemCount = this.state.todoItemCount
        var todoItems = this.state.todoItems

        for (let i = 0; i < todoItems.length; i++) {
            let currentItem = todoItems[i]
            if (currentItem.checked === true) {
                todoItems.splice(i, 1)
            }
        }
        checkedItemsCount = 0
        todoItemCount = todoItems.length
        console.log(todoItems)

        this.setState({ todoItems: todoItems, checkedTodoItemsCount: checkedItemsCount, todoItemCount: todoItemCount })
    }

    handleCheckTodoItem(event) {
        var checkedItemsCount = this.state.checkedTodoItemsCount
        var todoItems = this.state.todoItems
        var itemBoxId = event.target.id
        var itemId = event.target.getAttribute('data-id')

        var crossedText = document.getElementsByClassName(itemBoxId)[0]
        crossedText.classList.toggle('checked')
        if (crossedText.classList.contains('checked')) {
            checkedItemsCount++

            for (let i = 0; i < todoItems.length; i++) {
                let currentItem = todoItems[i]
                if (currentItem.id == itemId) {
                    currentItem.checked = true
                }
            }
        } else {
            checkedItemsCount--

            for (let i = 0; i < todoItems.length; i++) {
                let currentItem = todoItems[i]
                if (currentItem.id == itemId) {
                    currentItem.checked = false
                }
            }
        }
        this.setState({ todoItems: todoItems, checkedTodoItemsCount: checkedItemsCount })
    }

    handleDeleteTodoItem(event) {
        console.log('inna')
        var todoItems = this.state.todoItems
        var currentId = this.state.todoItemCount
        var todoItemId = event.target.getAttribute('data-id')
        currentId--

        for (let i = 0; i < todoItems.length; i++) {
            let currentItem = todoItems[i]
            if (currentItem.id == todoItemId) {
                todoItems.splice(i, 1)
            }
        }

        this.setState({ todoItems: todoItems, todoItemCount: currentId })
    }

    handleAddNewTodoItem(event) {
        if (event.key === 'Enter') {
            if (event.target.value === '') {
                return false;
            }
            var todoItems = this.state.todoItems
            var currentId = this.state.todoItemCount
            currentId++
            var item = {
                id: currentId,
                itemText: event.target.value,
                checked: false,
            }

            todoItems.push(item)
            this.setState({ todoItems: todoItems, todoItemCount: currentId })
            event.target.value = ''
        }
    }

    render() {
        const itemsCount = this.state.todoItems.length - this.state.checkedTodoItemsCount
        return (
            <main>
                <Header />
                <AddTodo addNewTodoItem={(Event) => this.handleAddNewTodoItem(Event)} />
                <TodoWrapper
                    clearCompleted={() => this.handleClearCompleted()}
                    deleteItem={(Event) => this.handleDeleteTodoItem(Event)}
                    checkItem={(Event) => this.handleCheckTodoItem(Event)}
                    checkedItems={itemsCount}
                    todoItems={this.state.todoItems} />
            </main>
        )
    }
}

hop.init({
	projectId: "project_NDk3NDk5OTE3MzY0NTkyODI": // replace with your project ID
})


ReactDOM.render(
    <TodoApp />,
    document.getElementById('root')
);

// other functions
function detectColorScheme() {
    var theme = "light";    //default to light

    //local storage is used to override OS theme settings
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") === "dark") {
            theme = "dark";
        }
    } else if (!window.matchMedia) {
        //matchMedia method not supported
        return false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //OS theme setting detected as dark
        theme = "dark";
    }

    //dark theme preferred, set document with a `dark` class
    if (theme === "dark") {
        document.body.classList.add("dark");
        document.getElementsByClassName('toggle-day')[0].classList.add('active')
    } else {
        document.getElementsByClassName('toggle-night')[0].classList.add('active')

    }
}

detectColorScheme();
