import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'source-select',
  templateUrl: './source-select.component.html',
  styleUrls: ['./source-select.component.scss']
})
export class SourceSelectComponent implements OnInit {

  showInput: boolean = false;
  processing: boolean = false;
  hasError: boolean = false;

  value: string = "";

  @Output() sourceChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private wss: WebsocketService
  ) { }

  ngOnInit() {

    this.wss.listen('testUrlResult').subscribe((result) => {
      if(result === 'pass'){

        this.sourceChange.emit(this.value);
        this.reset();

      } else {

        this.hasError = true;
        this.value = "File not found: 404";
        this.processing = false;

      }
    });
  }

  input(value){
    this.value = value;
  }

  focus(){
    if(this.hasError){
      this.hasError = false;
      this.value = "";
    }
  }

  show(){
    this.showInput = true;

    setTimeout(() => {
      this.reset();
    },12500);
  }

  update(){
    this.processing = true;

    if(!this.isValidUrl()){

      this.hasError = true;
      this.value = "Invalid URL";
      this.processing = false;

    }else if(!this.isMp4()){

      this.hasError = true;
      this.value = "Must link to mp4";
      this.processing = false;

    } else {

      this.wss.emit('testUrl', this.value);

    }

  }

  private reset(){

    this.showInput = false;
    this.processing = false;
    this.hasError = false;  
    this.value = "";

  }


  private isValidUrl(): boolean{
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(this.value);
  }

  private isMp4(): boolean{

    let ext:string = this.value.split('.').pop().toLowerCase();
    return ext === 'mp4';

  }

}
