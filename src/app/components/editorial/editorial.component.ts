import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-editorial',
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.css']
})
export class EditorialComponent implements OnInit {
  
  public title = "Editorial | Journal of Food Stability";

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private metaService: MetaService,
  ) { }


  ngOnInit(): void {
    this.metaService.createCanonicalURL("https://foodstability.com/editorial");
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'description', content: 'Editorial of the Journal of Food stability.The Journal of Food Stability is managed by the editor-in-chief Dr Tonfack Djikeng.It can be reached out by email through j.food.stability@gmail.com and +237 657 380 654.Follow us on Facebook, Google+ and Twitter ' }
    );
  }

}
