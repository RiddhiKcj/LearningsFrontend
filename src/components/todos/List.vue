<template>
    <div class="todos">
      <div class="alert alert-danger" v-if="error">{{ error }}</div>
      <h3>Todos</h3>
      
      <input class="form-control"
        autofocus autocomplete="off"
        placeholder="What needs to be done?"
        v-model="newTodo"
        @keyup.enter="addTodo" />
      <br />
      <ul class="list-group">
        <li class="list-group-item" v-for="todo in todos" :key="todo.id" :todo="todo">
          <div v-show="todo != editedTodo" @dblclick="editTodo(todo)">
            <label>{{ todo.title }}</label>
            <i class="fa fa-trash-alt float-right" @click="removeTodo(todo)"></i>
          </div>
          <div v-show="todo == editedTodo">
            <input class="form-control"
              v-todo-focus
              @blur="updateTodo(todo)"
              @keyup.enter="updateTodo(todo)"
              v-model="todo.title"
            />
          </div>
        </li>
      </ul>
      <v-spacer />
      <v-btn @click="logout()">Logout</v-btn>
    </div>
  </template>
  
  <script>
  export default {
    name: 'List',
    data () {
      return {
        todos: [],
        newTodo: [],
        error: '',
        editedTodo: ''
      }
    },
    created () {
      if (!localStorage.signedIn) {
        this.$router.replace('/')
      } else {
        this.$http.secured.get('/api/v1/todos',{
          headers: {
            'Authorization': 'Bearer ' + localStorage.access
          }})
          .then(response => { this.todos = response.data })
          .catch(error => this.setError(error, 'Something went wrong'))
      }
    },
    methods: {
      setError (error, text) {
        this.error = (error.response && error.response.data && error.response.data.error) || text
      },
      addTodo () {
        const value = this.newTodo && this.newTodo.trim()
        if (!value) {
          return
        }
        this.$http.secured.post('/api/v1/todos', { todo: { title: this.newTodo } }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.access
          }
        })
          .then(response => {
            this.todos.push(response.data)
            this.newTodo = ''
          })
          .catch(error => this.setError(error, 'Cannot create todo'))
      },
      removeTodo (todo) {
        this.$http.secured.delete(`/api/v1/todos/${todo.id}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.access
          }
        })
          .then(response => {
            this.todos.splice(this.todos.indexOf(todo), 1)
            this.error = response
          })
          .catch(error => this.setError(error, 'Cannot delete todo'))
      },
      editTodo (todo) {
        this.editedTodo = todo
      },
      updateTodo (todo) {
        this.editedTodo = ''
        this.$http.secured.patch(`/api/v1/todos/${todo.id}`, { todo: { title: todo.title } }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.access
          }
        })
          .catch(error => this.setError(error, 'Cannot update todo'))
      },
      logout (){
        this.$http.secured.delete('/signin', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.access
          }
        })
          .then(response => {
            console.log(response)
            delete localStorage.access
            delete localStorage.csrf
            delete localStorage.signedIn
            this.$router.push('/')
          })
          .catch(error => this.setError(error, 'Cannot delete todo'))
      }
    },
    directives: {
      'todo-focus': function (el) {
        el.focus()
      }
    }
  }
  </script>
  
  <style lang="css">
  .todos ul li i.fa.fa-trash-alt {
    visibility: hidden;
    margin-top: 5px;
  }
  .todos ul li:hover {
    background: #fcfcfc;
  }
  .todos ul li:hover i.fa.fa-trash-alt {
    visibility: visible;
  }
  </style>