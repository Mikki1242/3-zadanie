<template>
  <div class="note-page">
    <note-title :note="note"/>
    <hr />
    <div>
      <icon-button 
        @action="undo" 
        type="undo"
        :disabled="!(this.histotyIndex > 0)"
        label="Undo"
        />
      <icon-button 
        @action="redo" 
        type="redo"
        :disabled="!(this.histotyIndex < (this.noteHistory.length - 1))"
        label="Redo"
      />
    </div>
    <ul>
      <todo-item
        v-for="(todo, index) in note.todos"
        :todo="todo"
        :key="index"
        @remove-todo="onRemoveTodo"
      />
    </ul>
    <div class="new-todo">
      <icon-button 
        color="orange" 
        type="add" 
        @action="addTodo"
        label="Add"
        ></icon-button>
      <span @click="addTodo">Создание задачи</span>
    </div>
    <hr />
    <div>
      <icon-button 
        color="green" 
        type="save" 
        @action="saveNote"
        label="Save"></icon-button>
      <icon-button 
        color="orange" 
        type="cancel" 
        @action="handleCancelEdit"
        label="Cancel"></icon-button>
      <icon-button 
        color="red" 
        type="delete" 
        @action="handleDeleteNote"
        label="Delete"></icon-button>
    </div>
    <hr />
  </div>
</template>

<script>
import TodoItem from "../components/TodoItem";
import { NoteService } from '../services/NoteService'
import { random } from '../utils'  
import Confirm from '../components/Confirm'
import { create } from 'vue-modal-dialogs'
import NoteTitle from '../components/NoteTitle'
import IconButton from '../components/IconButton'

/**
 * @function confirm вызов модельного окна для принятия действия
 */
const confirm = create(Confirm, 'title', 'content')

/**
 * @module Note страница заметки и создать новую страницу заметки
 */
export default {
  name: "Note",
  components: {
    "todo-item": TodoItem,
    "note-title": NoteTitle,
    "icon-button": IconButton
  },
  data() {
    return {
      noteHistory: [],
      histotyIndex: 0,
      watching: true,
      noteId: '',
      note: {},
    };
  },
  mounted() {
    this.noteId = this.$route.params.noteId
    if (this.noteId) {
      this.note = NoteService.getItemById(this.noteId)
    } else {
      
      this.note = {
        noteId: "",
        title: "",
        todos: [],
      }
      this.note.noteId = random()
    }
  },
  methods: {
  /**
   * Добавление новой TODO
   */
    addTodo() {
      this.note.todos.push({
        text: "",
        completed: false,
      });
    },
    /**
   * Обработка и удаление TODO
   */
    onRemoveTodo(todo) {
      let i = this.note.todos.indexOf(todo);
      this.note.todos.splice(i, 1);
    },
    /**
     * Сохранение 
     */
    saveNote() {
      NoteService.updateItem(this.note.noteId, this.note)
    },
    /**
     * отменить редактирование заметки и перенаправление на главную страницу
     */
    cancelEdit() {
      this.clearNote()
      this.$router.push("/");
    },
    /**
     * удаление заметки и перенаправление на главную страницу
     */
    deleteNote() {
      NoteService.removeItem(this.noteId)
      this.clearNote()
      this.$router.push("/");

    },
    /**
     * Очистить this.note 
     */
    clearNote(){
      this.note = {
        noteId: "",
        title: "",
        todos: [],
      }
    },
    /**
     * Отмена изменений
     */
    undo() {
      this.watching = false;
      if (this.histotyIndex > 0) {
        this.histotyIndex -= 1;
        this.note = this.noteHistory[this.histotyIndex];
      }
    },
     /**
     * Повторение изменения
     */
    redo() {
      this.watching = false;
      if (this.histotyIndex < (this.noteHistory.length - 1)) {
        this.histotyIndex += 1;
        this.note = this.noteHistory[this.histotyIndex];
      }
    },
     /**
     * обрабатывать удаление заметки с диалоговым окном подтверждения
     */
    async handleDeleteNote(noteId){
      if (await confirm('Вы действительно хотите удалить заметку?', 'Эта информация потеряется на всегда!')) {
        this.deleteNote(noteId)
        } 
    },
      /**
     * обработать отмену редактирования с диалоговым окном подтверждения
     */
    async handleCancelEdit(noteId){
      if (await confirm('Вы действительно хотите отменить редактирование и выйти на главную страницу?',
       'Все сохраненные изменения будут потеряны.')) {
        this.cancelEdit(noteId)
        } 
    },
  },
  watch: {
      /**
     *  сохранение истории изменений заметок, кроме отмены и повтора
     */
    note: {
      handler: function(val) {
        if (this.watching) {
          this.noteHistory.push(JSON.parse(JSON.stringify(val)));
          this.histotyIndex = this.noteHistory.length - 1;
        } else {
          this.watching = true;
        }
      },
      deep: true,
    },
  },
    /**
     *  безопасное перенаправление со страницы
     */
  async beforeRouteLeave (to, from, next) {
    if (await confirm('Вы действительно хотите удалить заметку?',
       'Эта информация потеряется на всегда!')) {
        this.clearNote()
        next()
      } else{
        next(from)
      }
  }
};
</script>

<style>
.new-todo{
  display: flex;
  justify-content: flex-start;
  background-color: #e2e2e2;
  height: 36px;
  margin: 5px 0px;
  padding-top: 4px;
  padding-left: 10px;
  padding-right: 15px;
  border-radius: 5px;
}
</style>
