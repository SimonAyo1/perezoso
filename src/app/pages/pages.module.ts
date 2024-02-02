import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

@NgModule({
  declarations: [OverviewComponent, HomeComponent, LeaderboardComponent],
  imports: [CommonModule, PagesRoutingModule, FormsModule],
})
export class PagesModule {}
