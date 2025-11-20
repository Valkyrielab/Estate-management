
function addField() {
  // Create a new input element
  const newLabel = document.createElement('labal');
  newLabel.for = 'item 1' ;
  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.name = 'item[1]';
  newInput.placeholder = ' ';
  const newLabel = document.createElement('labal');
  newLabel.for = 'item 2' ;
  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.name = 'item[2]';
  newInput.placeholder = ' ';
  const newLabel = document.createElement('labal');
  newLabel.for = 'item 3' ;
  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.name = 'item[3]';
  newInput.placeholder = ' ';
  const newLabel = document.createElement('labal');
  newLabel.for = 'item 4' ;
  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.name = 'item[4]';
  newInput.placeholder = ' ';
  const newLabel = document.createElement('labal');
  newLabel.for = 'item 5' ;
  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.name = 'item[5]';
  newInput.placeholder = ' ';

  
  // Add a line break for spacing
  const br = document.createElement('br');
  
  // Append to the form
  const form = document.getElementById('hr');
  form.insertBefore(br, form.querySelector('button'));
  form.insertBefore(newInput, form.querySelector('button'));
}