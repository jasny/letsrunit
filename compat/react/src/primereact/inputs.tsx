import { PrimeReactProvider } from 'primereact/api';
import { Checkbox } from 'primereact/checkbox';
import { Chips } from 'primereact/chips';
import { FileUpload } from 'primereact/fileupload';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { useState } from 'react';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

export function PrimeReactInputText(props: any) {
  return (
    <PrimeReactProvider>
      <label htmlFor="text">Text</label>
      <InputText id="text" {...props} />
    </PrimeReactProvider>
  );
}

export function PrimeReactInputTextarea(props: any) {
  return (
    <PrimeReactProvider>
      <label htmlFor="textarea">Textarea</label>
      <InputTextarea id="textarea" {...props} />
    </PrimeReactProvider>
  );
}

export function PrimeReactFileInput(props: any) {
  const [files, setFiles] = useState<string[]>([]);

  return (
    <PrimeReactProvider>
      <div aria-label="result">{files.join(', ')}</div>
      <FileUpload
        name="upload"
        customUpload
        mode="basic"
        chooseLabel="Upload"
        onSelect={(event) => setFiles(Array.from(event.files ?? [], (file: File) => file.name))}
        onClear={() => setFiles([])}
        {...props}
      />
    </PrimeReactProvider>
  );
}

export function PrimeReactChips(props: any) {
  const [value, setValue] = useState<string[]>([]);

  return (
    <PrimeReactProvider>
      <label htmlFor="chips">Tags</label>
      <Chips inputId="chips" value={value} onChange={(event) => setValue(event.value ?? [])} {...props} />
      <div aria-label="result">{value.join(', ')}</div>
    </PrimeReactProvider>
  );
}

export function PrimeReactCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <PrimeReactProvider>
      <label htmlFor="cb">Accept</label>
      <Checkbox inputId="cb" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} />
    </PrimeReactProvider>
  );
}

export function PrimeReactInputSwitch() {
  const [checked, setChecked] = useState(false);
  return (
    <PrimeReactProvider>
      <label htmlFor="sw">Switch</label>
      <InputSwitch inputId="sw" checked={checked} onChange={(e) => setChecked(e.value ?? false)} />
    </PrimeReactProvider>
  );
}

export function PrimeReactRadioButton() {
  const [ingredient, setIngredient] = useState('');
  return (
    <PrimeReactProvider>
      <div className="flex align-items-center">
        <RadioButton
          inputId="ingredient1"
          name="pizza"
          value="Cheese"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === 'Cheese'}
        />
        <label htmlFor="ingredient1" className="ml-2">
          Cheese
        </label>
      </div>
      <div className="flex align-items-center">
        <RadioButton
          inputId="ingredient2"
          name="pizza"
          value="Mushroom"
          onChange={(e) => setIngredient(e.value)}
          checked={ingredient === 'Mushroom'}
        />
        <label htmlFor="ingredient2" className="ml-2">
          Mushroom
        </label>
      </div>
    </PrimeReactProvider>
  );
}
