import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {


  public title = "Review Process | Journal of Food Stability";

  constructor(
    private titleService: Title,
    private metaTagService: Meta
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'description', content: 'Reviews in the Journal for Food Stability are done by all the panelists or members of the Editorial Board.They all go through the manuscripts and send feedback to the editor-in-chief who does the final compilations' }
    );
  }

}
