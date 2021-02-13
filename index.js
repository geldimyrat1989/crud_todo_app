//require express
const express = require('express');
//assign express and execute to a variable
const app = express();
// require method override
const methodOverride = require('method-override');
// to require uuid for creating unique ids for todos 
const { v4: uuid } = require('uuid');
// path for joining path
const path = require('path');

//to parse data in post request body.
app.use(express.urlencoded({ extended: true }));
//to parse incoming JSON in post request body.
app.use(express.json());
// to fake put/patch/delete requests.
app.use(methodOverride('_method'))
//Views folder and EJS setup:
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

let todos = [
    {
        id: uuid(),
        time: 'morning',
        thingsToDo: 'to code'
    },
    {
        id: uuid(),
        time: 'afternoon',
        thingsToDo: 'Go to Aksaray'
    }
]

//this renders todos page:
app.get('/todos', (req, res) =>
{
    //this reners the todos/idex.ejs page and passes over todos object {todos}:
    res.render('todos/index', { todos });
})

//will display a form where we add new todos:
app.get('/todos/new', (req, res) =>
{
    res.render('todos/new');
})
//create new todo:
app.post('/todos', (req, res) =>
{
    const { thingsToDo, time } = req.body;
    todos.push({ time, thingsToDo, id: uuid() });
    res.redirect('/todos');
})

//show details about particular todo:
app.get('/todos/:id', (req, res) =>
{
    //here we have to find particular id from req.params object:
    const { id } = req.params;
    const todo = todos.find(t => t.id === id);
    //after finding the id pass it and render in the show page:
    res.render('todos/show', { todo });
})

//Now to edit the todo:
app.get('/todos/:id/edit', (req, res) =>
{
    //have to get id of a particular todo to edit:
    const { id } = req.params;
    //have to find by id:
    const todo = todos.find(t => t.id === id);
    //render the edit page:
    res.render('todos/edit', { todo });
})

//time to make PATCH request:
app.patch('/todos/:id', (req, res) =>
{
    //getting id :
    const { id } = req.params;
    //finding the todo and asign it to a const:
    const foundTodo = todos.find(t => t.id === id);
    //get new todo from req.body:
    const newTodo = req.body.thingsToDo;
    //update the todo with data from req.body:
    foundTodo.thingsToDo = newTodo;
    //redirect back to index page:
    res.redirect('/todos');
})
//now time to DELETE a particular todo from the array:
app.delete('/todos/:id', (req, res) =>
{
    //as usual need to get id first:
    const { id } = req.params;
    //we make a new array without that particular id:
    todos = todos.filter(t => t.id !== id);
    //and we rdirect to the index page:
    res.redirect('/todos');
})


//this is express listening for port 3000:
app.listen(3000, () =>
{
    console.log('Listening on port 3000!');
})