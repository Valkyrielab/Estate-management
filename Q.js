
let counter = 1;

function addHiers() {
  counter++;

  // Get the first executor group
  const originalGroup = document.querySelector('.Hiers-group');

  // Clone it
  const newGroup = originalGroup.cloneNode(true);

  
// Update IDs and labels for accessibility
  newGroup.querySelectorAll('input').forEach((input, index) => {
    const newId = input.name.replace('[]', '') + counter;
    input.id = newId;
    input.value = ''; // Clear previous values
    input.placeholder = '';
  });

  newGroup.querySelectorAll('label').forEach((label, index) => {
    const input = newGroup.querySelectorAll('input')[index];
    label.setAttribute('for', input.id);
  });

  
 // Insert before the button
  const form = document.getElementById('Hiers');
  form.insertBefore(newGroup, form.querySelector('button'));
}



let counter = 1;

function addExecutor() {
  counter++;

  // Get the first executor group
  const originalGroup = document.querySelector('.executor-group');

  // Clone it
  const newGroup = originalGroup.cloneNode(true);

  
// Update IDs and labels for accessibility
  newGroup.querySelectorAll('input').forEach((input, index) => {
    const newId = input.name.replace('[]', '') + counter;
    input.id = newId;
    input.value = ''; // Clear previous values
    input.placeholder = '';
  });

  newGroup.querySelectorAll('label').forEach((label, index) => {
    const input = newGroup.querySelectorAll('input')[index];
    label.setAttribute('for', input.id);
  });

  
 // Insert before the button
  const form = document.getElementById('Executors');
  form.insertBefore(newGroup, form.querySelector('button'));
}
