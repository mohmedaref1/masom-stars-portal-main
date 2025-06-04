document.addEventListener('DOMContentLoaded', function() {
  const backToHomeButton = document.getElementById('backToHomeButton');
  if (backToHomeButton) {
    backToHomeButton.addEventListener('click', function() {
      window.location.href = '/';
    });
  }
});
