import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { GenderOptions } from '../../enums/GenderOptions';
import { IUser } from '../../models/IUser';
import { Subscription } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { EnumProvider } from '../../providers/enum/enum';
import moment from 'moment';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
  heightOptions: string[];
  genderOptions: string[];
  dietOptions: string[];
  religionOptions: string[];
  alcoholOptions: string[];
  cigaretteOptions: string[];
  drugOptions: string[];
  childrenOptions: string[];
  educationOptions: string[];
  physicalActivityOptions: string[];
  relationshipStatusOptions: string[];
  intentionOptions: string[];

  user: IUser;
  userSubscription: Subscription;
  isUpdating: boolean = false;

  maxDate: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public enumProvider: EnumProvider,
    public toastCtrl: ToastController,
    public geolocationProvider: GeoLocationProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');

    let maxDate = new Date((new Date().getFullYear() - 18),new Date().getMonth(), new Date().getDate());
    this.maxDate = moment(maxDate).format("YYYY-MM-DD");

    this.heightOptions = this.enumProvider.getHeightOptions();
    this.genderOptions = this.enumProvider.getGenderOptions();
    this.relationshipStatusOptions = this.enumProvider.getRelationshipStatusOptions();
    this.dietOptions = this.enumProvider.getDietOptions();
    this.religionOptions = this.enumProvider.getReligionOptions();
    this.alcoholOptions = this.enumProvider.getAlcoholOptions();
    this.cigaretteOptions = this.enumProvider.getCigaretteOptions();
    this.drugOptions = this.enumProvider.getDrugOptions();
    this.childrenOptions = this.enumProvider.getChildrenOptions();
    this.educationOptions = this.enumProvider.getEducationOptions();
    this.physicalActivityOptions = this.enumProvider.getPhysicalActivityOptions();
    this.intentionOptions = this.enumProvider.getIntentionOptions();

    this.userSubscription = this.db
      .object(`userData/${firebase.auth().currentUser.uid}`)
      .valueChanges()
      .subscribe((user: IUser) => {
        this.user = user;

        if (!this.user.preferences) {
          this.user.preferences = {};
        }

        this.user.birthdate = moment(this.user.birthdate).format('YYYY-MM-DD');
      });
  }

  ionViewDidLeave() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  async submitForm() {
    this.isUpdating = true;
    let form = {...this.user};

    form.username = form.username || '';

    if (!form.username.trim()) {
      this.presentToast('Oops, your username is required!');
      return;
    }

    form.city = form.city || '';
    form.state = form.state || '';
    form.country = form.country || '';

    form.birthdate = form.birthdate ? moment(form.birthdate).toISOString(true): null;
    form.searchName = `${form.username.trim().toLowerCase()}`
    form.searchAddress = `${form.city.trim().toLowerCase()} ${form.state.trim().toLowerCase()} ${form.country.trim().toLowerCase()}`

    form.geolocation = await this.geolocationProvider.geocodeAddress(form.searchAddress).catch(err => {
      console.log('Error on retrieving geolocation for provided address:', err);
      return null;
    });

    console.log('updating profile with values:', form);

    this.db.object(`userData/${firebase.auth().currentUser.uid}`).set(form).then(() => {
      this.isUpdating = false;
      this.presentToast('Profile updated!');
    }).catch((err: Error) => {
      console.log('error:', err.message);
      this.isUpdating = false;
      this.presentToast('Oops, something went wrong.');
    });
  }

  presentToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).present();
  }
}
