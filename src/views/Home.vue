<template>
  <div class="home">
    <div v-if="!notes.length">
      <h3>Заметки</h3>
      <icon-button 
        color="orange" 
        type="add" 
        @action="$router.push('/note')"
        label="Add"
        ></icon-button>
      <hr />
    </div>
    <div>
      <note-card
        v-for="note in notes"
        :note="note"
        :key="note.title"
        @delete-note="handleDeleteNote"
      />
    </div>
  </div>
</template>

<script>
import NoteCard from "../components/NoteCard";
import { NoteService } from '../services/NoteService' 
import Confirm from '../components/Confirm'
import { create } from 'vue-modal-dialogs'
import IconButton from '../components/IconButton'

/**
 * @function confirm вызов модельного окна для принятия действия
 */
const confirm = create(Confirm, 'title', 'content')

/**
 * @module Home главная страница, содержащая список заметок
 */

export default {
  name: "Home",
  data() {
    return {
      notes: []
    };
  },
  components: {
    "note-card": NoteCard,
    "icon-button": IconButton
    
  },
  mounted () {
    this.fetchNotes()
  },
  methods: {
    deleteNote(noteId) {
      NoteService.removeItem(noteId)
      this.fetchNotes()
    },
      /**
     * Получает все заметки
     */
    fetchNotes(){
      this.notes = NoteService.fetchNotes()
    },
      /**
     * Удаляет заметку
     */
    async handleDeleteNote(noteId){
      if (await confirm('Вы действительно хотите удалить заметку?', 'Эта информация потеряется на всегда!')) {
        this.deleteNote(noteId)
        } 
    }
  },
};
</script>

<style scoped>
div{
  text-align: center;
}
</style>
