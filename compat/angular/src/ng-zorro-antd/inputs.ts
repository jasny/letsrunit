import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  standalone: true,
  imports: [FormsModule, NzInputModule],
  template: `
    <input nz-input aria-label="text" [(ngModel)]="value" />
  `,
})
export class NzInputFixture {
  value = '';
}

@Component({
  standalone: true,
  imports: [FormsModule, NzInputModule],
  template: `
    <textarea nz-input aria-label="text" [(ngModel)]="value"></textarea>
  `,
})
export class NzInputMultilineFixture {
  value = '';
}

@Component({
  standalone: true,
  imports: [HttpClientModule, NzButtonModule, NzUploadModule],
  template: `
    <div aria-label="result">{{ names.join(', ') }}</div>
    <nz-upload
      nzName="upload"
      [nzMultiple]="true"
      [nzCustomRequest]="customRequest"
      (nzFileListChange)="onFileListChange($event)"
    >
      <button type="button" nz-button>Upload</button>
    </nz-upload>
  `,
})
export class NzFileInputFixture {
  names: string[] = [];
  private cdr = inject(ChangeDetectorRef);

  customRequest = (item: { onSuccess?: (body: unknown, file?: unknown, xhr?: unknown) => void }) => {
    const timeout = window.setTimeout(() => item.onSuccess?.({}, undefined, undefined), 0);
    return new Subscription(() => window.clearTimeout(timeout));
  };

  onFileListChange(fileList: Array<{ name?: string }>) {
    this.names = fileList.map((file) => file.name ?? '').filter(Boolean);
    this.cdr.detectChanges();
  }
}

@Component({
  standalone: true,
  imports: [FormsModule, NzSwitchModule],
  template: `
    <nz-switch aria-label="switch" [(ngModel)]="checked"></nz-switch>
    <div aria-label="result">{{ checked ? 'on' : 'off' }}</div>
  `,
})
export class NzSwitchFixture {
  checked = false;
}

@Component({
  standalone: true,
  imports: [FormsModule, NzCheckboxModule],
  template: `
    <label nz-checkbox [(ngModel)]="checked">Checkbox</label>
  `,
})
export class NzCheckboxFixture {
  checked = false;
}

@Component({
  standalone: true,
  imports: [FormsModule, NzRadioModule],
  template: `
    <nz-radio-group [(ngModel)]="selected">
      <label nz-radio nzValue="female">Female</label>
      <label nz-radio nzValue="male">Male</label>
      <label nz-radio nzValue="other">Other</label>
    </nz-radio-group>
  `,
})
export class NzRadioGroupFixture {
  selected = 'female';
}

@Component({
  standalone: true,
  imports: [FormsModule, NzSelectModule, NzNoAnimationModule],
  template: `
    <nz-select nzNoAnimation aria-label="age" [(ngModel)]="selected">
      <nz-option nzValue="10" nzLabel="Ten"></nz-option>
      <nz-option nzValue="20" nzLabel="Twenty"></nz-option>
      <nz-option nzValue="30" nzLabel="Thirty"></nz-option>
    </nz-select>
    <div aria-label="result">{{ selected }}</div>
  `,
})
export class NzSelectFixture {
  selected = '20';
}
