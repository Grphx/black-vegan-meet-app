import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConversationProvider } from '../../providers/conversation/conversation';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs';
import { IConversationListItem } from '../../models/IConversationListItem';
import firebase from 'firebase';
import { IUser } from '../../models/IUser';

/**
 * Generated class for the ConversationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conversation-list',
  templateUrl: 'conversation-list.html'
})
export class ConversationListPage {
  conversationList: IConversationListItem[] = [];
  conversationListSubscription: Subscription;
  isFetching: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public conversationProvider: ConversationProvider,
    public db: AngularFireDatabase
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversationListPage');

    this.loadUserConversations();
  }

  ionViewDidLeave() {
    if (this.conversationListSubscription)
      this.conversationListSubscription.unsubscribe();
  }

  loadUserConversations() {
    const currentUserId = firebase.auth().currentUser.uid;
    this.conversationListSubscription = this.db
      .list(
        `${this.conversationProvider.dbUserConversationsPath}/${currentUserId}`,
        ref => ref.orderByChild('lastMessageTimestamp')
      )
      .valueChanges()
      .subscribe((conversationItems: IConversationListItem[]) => {
        this.conversationList = conversationItems.reverse();
        this.isFetching = false;
      });
  }
}
