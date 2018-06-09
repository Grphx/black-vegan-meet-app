import { Injectable } from '@angular/core';
import { EnumProvider } from '../enum/enum';
import { IRefineSearchFilters } from '../../models/IRefineSearchFilters';
import { IUser } from '../../models/IUser';

/*
  Generated class for the RefineSearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

class RefineSearchFilters implements IRefineSearchFilters {
  // Basic Search
  location;
  distance;
  gender;
  ageRange;

  // Premium Search
  heightRangeIndex;
  preferenceReligion;
  preferenceChildren;
  premiumSubscription;
  onlineRecently;
  newUsers;
  moreThanOnePhoto;
  completeProfile;
  preferenceDiet;
  preferenceEducation;
  preferenceDrug;
  preferenceAlcohol;
  preferenceCigarette;

  constructor(heightOptions: string[]) {
    // Init Basic Search values
    this.distance = 130;
    this.gender = '';
    this.ageRange = {
      lower: 30,
      upper: 50
    };

    // Init Premium Search values
    this.heightRangeIndex = {
      lower: 0,
      upper: heightOptions.length - 1
    };
    this.premiumSubscription = false;
    this.onlineRecently = false;
    this.newUsers = false;
    this.moreThanOnePhoto = false;
    this.completeProfile = false;

    this.preferenceReligion = '';
    this.preferenceChildren = '';
    this.preferenceDiet = '';
    this.preferenceEducation = '';
    this.preferenceDrug = '';
    this.preferenceAlcohol = '';
    this.preferenceCigarette = '';
  }
}

@Injectable()
export class RefineSearchProvider {
  constructor(private enumProvider: EnumProvider) {
    console.log('Hello RefineSearchProvider Provider');
  }

  getFilters() {
    return new RefineSearchFilters(this.enumProvider.getHeightOptions());
  }
}
