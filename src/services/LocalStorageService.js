export const LocalStorageService = {
  /**
   * Получить данный из LS
   * Позволяет сохранять любые данные JSON
   * @param {String} key - Ключ для получения данных
   * @param {*} [fallback] - резервное значение, если ключ не найден
   * @return {*}
   */
  getItem (key, fallback) {
    try {
      let item = window.localStorage.getItem(key)
      return item ? window.JSON.parse(item) : fallback
    } catch (err) {
      return fallback
    }
  },
  /**
   * Устанавливает элемент по ключу
   * @param {String} key - Ключ для сохранения
   * @param {*} value - Ценность для экономии. Преобразуется в строку JSON
   */
  setItem (key, value = {}) {
    window.localStorage.setItem(key, window.JSON.stringify(value))
  },
  /**
   * Удалить предмет по его ключу
   * @param {string} key
   */
  removeItem (key) {
    window.localStorage.removeItem(key)
  },
  /**
   * Удаляет все предметы из хранилища
   */
  clearAllItems () {
    window.localStorage.clear()
  }
}
