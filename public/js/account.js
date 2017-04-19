$(function () {
  $('a.list-group-item').click(function (event) {
    if ($(event.target)[0].nodeName !== 'A') {
      event.preventDefault()
    }
  })
  $('#AccountModal').on('show.bs.modal', function (event) {
    // event.stopPropagation()
    var button = $(event.relatedTarget) // Button that triggered the modal
    var formType = button.data('form-type')
    var modal = $(this)

    if (formType === 'edit') {
      var accountId = button.data('account-id')
      var accountName = button.data('account-name')

      modal.find('.modal-title').text('Edit Account')
      modal.find('form#accountForm').attr('action', '/accounts/' + accountId + '?_method=PUT')
      modal.find('input').val(accountName)
      modal.find('button#addEditButton').text('Save')
    } else if (formType === 'add') {
      modal.find('.modal-title').text('Add New Account')
      modal.find('form#accountForm').attr('action', '/accounts/')
      modal.find('button#addEditButton').text('Save')
    }
  })

  function getCategoryName (categories, subcategoryId) {
    var topCategory
    for (var i = 0; i < categories.length; i++) {
      var subCats = categories[i].subCategories
      for (var j = 0; j < subCats.length; j++) {
        console.log(subcategoryId)
        console.log(subCats[j]._id)
        if (subCats[j]._id === subcategoryId) {
          topCategory = categories[i].name
        }
      }
    }
    return topCategory
  }
})
