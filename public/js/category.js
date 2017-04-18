$(function () {
  $('#editFormModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var editType = button.data('type')
    var modal
    if (editType === 'subCat') {
      var subCatId = button.data('subcategory-id') // Extract info from data-* attributes
      var subCatName = button.data('subcategory-name')

      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.

      modal = $(this)
      modal.find('form').attr('action', '/categories/sub/' + subCatId + '?_method=PUT')
      modal.find('label').attr('for', 'subCategoryEditName')
      modal.find('input').attr('name', 'subCategoryEditName')
      modal.find('input').val(subCatName)
      // modal.find('.modal-title').text('New message to ' + recipient)
      // modal.find('.modal-body input').val(recipient)
    } else if (editType === 'cat') {
      var catId = button.data('category-id') // Extract info from data-* attributes
      var catName = button.data('category-name')

      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.

      modal = $(this)
      modal.find('form').attr('action', '/categories/' + catId + '?_method=PUT')
      modal.find('label').attr('for', 'categoryEditName')
      modal.find('input').attr('name', 'categoryEditName')
      modal.find('input').val(catName)
    }
  })
})
