export type TimelineIcon = 'plus' | 'edit' | 'pause' | 'play' | 'trash' | 'check' | 'calendar' | 'clock';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  actor: string;
  occurredAt: Date;
  icon: TimelineIcon;
}
