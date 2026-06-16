import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';

type NotifyType = 'success' | 'error' | 'warning' | 'info';

interface NotifyOptions {
  width?: number;
  displayTime?: number;
}

/**
 * Centralizes DevExtreme toast notifications with a consistent position/stack,
 * replacing the raw `notify({...}, {...})` calls previously duplicated in pages.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private show(message: string, type: NotifyType, options?: NotifyOptions): void {
    notify(
      {
        message,
        type,
        displayTime: options?.displayTime ?? 3000,
        width: options?.width,
      },
      { direction: 'up-stack', position: 'top center' }
    );
  }

  success(message: string, options?: NotifyOptions): void {
    this.show(message, 'success', options);
  }

  warning(message: string, options?: NotifyOptions): void {
    this.show(message, 'warning', options);
  }

  error(message: string, options?: NotifyOptions): void {
    this.show(message, 'error', options);
  }

  info(message: string, options?: NotifyOptions): void {
    this.show(message, 'info', options);
  }
}
