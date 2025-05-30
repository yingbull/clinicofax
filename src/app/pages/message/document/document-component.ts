import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DocumentService } from './document.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentDatabase } from './document-database.component';
import { DocumentDataSource } from './document-datasource.component';
import { ModalComponent } from '../../../modal.component';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ContactService } from '../../contact/contact.service';
import { Contact } from '../../contact/contact';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { SendFax } from '../../sendfax/sendfax';
import { SendFaxService } from '../../sendfax/sendfax.service';
import { DocumentProgram } from '../../campaigns/campaign';
import { DID } from '../../did/did';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Document } from './document';


@Component({
  selector: 'ngx-document-component',
  templateUrl: './document-component.html',
  styleUrls: ['./document-component.scss'],
})

export class FormsDocumentComponent implements OnInit {
  constructor(
    private document_service: DocumentService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<Document>,
    private modalService: NgbModal,
    private contact_service: ContactService,
    private completerService: CompleterService,
    private sendfax_service: SendFaxService) { }

  aDocument: Document[];
  DocumentDataSource: NbTreeGridDataSource<Document>;
  length: number;
  closeResult: any;

  contactArray: Contact[] = [];
  dataService: CompleterData;
  trans_id:any;
  accountArray : DID[]=[]
  documentProgram: DocumentProgram = new DocumentProgram;
  private modalRef: NgbModalRef;
  displayedColumns= ['document_id', 'name', 'Operations'];
  documentURL: string;
  // documentURL: string = "http://demo.ictfax.com/data/document/document_0_74.tif.pdf";
  // faxDocumentURL: string = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  faxDocumentURL: string;
  totalPages: number = 0;
  page: number = 1;
  isLoaded: boolean = false;

  items_page = [5, 10, 25, 100];
  pageSize = 10;
  startIndex: number = 0;
  currentPage: number;
  total_pages: number;
  minimumItems: number;
  current_items: any[] = [];

  @ViewChild('filter', {static: false}) filter: ElementRef;

  sendfax: SendFax = new SendFax;

  ngOnInit() {
    this.getDocumentlist();
    this.getContactList();
    this.getAccountList()
  }

  getDocumentlist() {
    this.document_service.get_DocumentList().then(data => {
      this.aDocument = data.sort((a, b) => b.document_id - a.document_id);
      this.length = data.length;   

      this.paginate(this.pageSize);
      this.DocumentDataSource = this.dataSourceBuilder.create(this.current_items.map(item => ({ data: item })));



    });
  }
  paginate(page_Items: string | number) {
    if (typeof page_Items === 'string') {
      if (page_Items === 'next') {
        if (this.startIndex + this.pageSize < this.length) {
          this.startIndex += this.pageSize; 
        }
      } else if (page_Items === 'previous') {
        if (this.startIndex > 0) {
          this.startIndex -= this.pageSize;
        }
      }
    } else {
      this.pageSize = page_Items;
      this.startIndex = 0; 
    }
    this.currentPage = Math.floor(this.startIndex / this.pageSize) + 1;
    this.total_pages = Math.ceil(this.length / this.pageSize);
    this.minimumItems = Math.min(this.startIndex + this.pageSize, this.length);    
    
    const end = Math.min(this.startIndex + this.pageSize, this.length);
    this.current_items = this.aDocument.slice(this.startIndex, end); 
    this.DocumentDataSource = this.dataSourceBuilder.create(this.current_items.map(item => ({ data: item })));
  }

  deleteDocument(document_id): void {
    this.document_service.delete_Document(document_id)
    .then(response => {})
    .catch(this.handleError);
    this.getDocumentlist();
  }

  // Modal related
  showStaticModal(name, document_id) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      container: 'nb-layout',
    });

    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete ${name}?`;
    activeModal.result.then((result) => {
      this.closeResult = result;
      if (this.closeResult === 'yes_click') {
        this.deleteDocument(document_id);
      }
    }, (reason) => {
      this.closeResult = this.getDismissReason(reason);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  // Send Fax related Form
  open(content, document_id) {
    this.documentProgram.document_id = document_id;
    this.modalRef = this.modalService.open(content,  { size: 'md' });

    this.modalRef.result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // Show Fax PDF
  showPDF(content, document_id) {
    this.modalRef = this.modalService.open(content,  { size: 'md' });
    this.viewFaxDocument(document_id);
    // console.log('check docuemnt data', this.viewFaxDocument(document_id));
  }
  // Load PDF document
  viewFaxDocument(document_id) {
    this.totalPages = 0;
    this.isLoaded = false;
    const url = this.document_service.get_ViewFaxDocument(document_id);
    this.faxDocumentURL = url;
    // console.log("check data faxDocumentURL", this.faxDocumentURL);
  }
  nextPage() {
    this.page += 1;
  }
  previousPage() {
    this.page -= 1;
  }
  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  closeModal() {
    this.modalRef.close();
  }

  getContactList() {
    this.contact_service.get_ContactList().then(data => {
      this.contactArray = data;
      this.dataService = this.completerService.local(this.contactArray, 'phone', 'phone');
    })
  }

  onSelected(item: CompleterItem) {
    if (item != null) {
      this.sendfax.contact_id = item.originalObject.contact_id;
    }
    else {
      this.sendfax.contact_id = undefined;
    }
  }

  addSendDocument(): void {
    if (this.sendfax.contact_id != undefined) {
        this.sendfax.phone = undefined;
    }
    this.sendfax_service.add_senddocument(this.documentProgram).then(response => {
      const program_id = response;
      this.sendfax.program_id = program_id;
      this.AddTransmission();
      this.closeModal();
    });
  }

  AddTransmission(): void {
    this.sendfax_service.add_SendFax(this.sendfax).then(response => {
      const transmission_id = response;
      this.trans_id = transmission_id;
      this.AddSend(this.trans_id);
    });
  }

  AddSend(trans_id): void {
    this.sendfax_service.send_transmission(this.trans_id).then(response => {
    });
  }

  downloadDocument(document_id) {
    this.document_service.get_Documentdownload(document_id);
  }


  getAccountList(){
    this.sendfax_service.get_AccountList().then(data =>{
      this.accountArray=data;
      this.sendfax.account_id = this.accountArray[this.accountArray.length-1].account_id
    })
  }

  onSelectedAccount(value){
    if(value ! =0){
      this.sendfax.account_id = value;
;    }
else{
  this.sendfax.account_id = undefined
}
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
