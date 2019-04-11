import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Ride} from "./ride";
import {RideListService} from "./ride-list.service";
import {AddRideComponent} from "./add-ride.component";
import {EditRideComponent} from "./edit-ride.component";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {DeleteRideComponent} from "./delete-ride.component";
import {User} from "../users/user";

@Component({
  selector: 'ride-list-component',
  templateUrl: 'ride-list.component.html',
  styleUrls: ['./ride-list.component.css'],
})


export class RideListComponent implements OnInit {

  public rides: Ride[];
  public filteredRides: Ride[];
  public users: User[];

  public rideDestination: string;
  public rideDriving: string;

  private highlightedDestination: string = '';


  constructor(public rideListService: RideListService, public dialog: MatDialog) {
  }

  isHighlighted(ride: Ride): boolean {
    return ride.destination === this.highlightedDestination;
  }


  openAddDialog(): void {
    const newRide: Ride = {driver: '', destination: '', origin: '', roundTrip: false, driving: false, departureDate: '', departureTime: '', mpg: null, notes: ''};

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {ride:newRide, users: this.users};
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(AddRideComponent, dialogConfig);



    dialogRef.afterClosed().subscribe(newRide => {
      if (newRide != null) {
        console.log(newRide);
        this.rideListService.addNewRide(newRide).subscribe(
          result => {
            this.highlightedDestination = result;
            this.refreshRides();
          },
          err => {
            // This should probably be turned into some sort of meaningful response.
            console.log('There was an error adding the ride.');
            console.log('The newRide or dialogResult was ' + JSON.stringify(newRide));
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  openEditDialog(currentId: object,currentDriver: string, currentDestination: string, currentOrigin: string, currentRoundTrip: boolean, currentDriving: boolean, currentDepartureDate: string, currentDepartureTime: string, currentMPG: number, currentNotes: string): void {
    const currentRide: Ride = {
      _id: currentId,
      driver: currentDriver,
      destination: currentDestination,
      origin: currentOrigin,
      roundTrip: currentRoundTrip,
      driving: currentDriving,
      departureDate: currentDepartureDate,
      departureTime: currentDepartureTime,
      mpg: currentMPG,
      notes: currentNotes
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {ride:currentRide,};
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(EditRideComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(currentRide => {
      if (currentRide != null) {//RideListComponent
        currentRide.mpg = "" + currentRide.mpg;
        this.rideListService.editRide(currentRide).subscribe(
          result => {
            this.highlightedDestination = result;
            console.log("The result is " + result);
            this.refreshRides();
          },
          err => {
            console.log('There was an error editing the ride.');
            console.log('The currentRide or dialogResult was ' + JSON.stringify(currentRide));
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }


  openDeleteDialog(currentId: object): void {
    console.log("openDeleteDialog");

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {id: currentId};
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(DeleteRideComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(deletedRideId => {
      if (deletedRideId != null) {
        this.rideListService.deleteRide(deletedRideId).subscribe(
          result => {
            console.log("openDeleteDialog has gotten a result!");
            this.highlightedDestination = result;
            console.log("The result is " + result);
            this.refreshRides();
          },
          err => {
            console.log('There was an error deleting the ride.');
            console.log('The id we attempted to delete was  ' + deletedRideId);
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  public filterRides(searchDestination: string): Ride[] {

    this.filteredRides = this.rides;


    if (searchDestination != null) {
      searchDestination = searchDestination.toLocaleLowerCase();

      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchDestination || ride.destination.toLowerCase().indexOf(searchDestination) !== -1;
      });
    }

    return this.filteredRides
      //.sort(function(a,b) {return new String(a.departureTime).localeCompare(new String (b.departureTime))})
      //.sort(function(a,b) {return +new Date(a.departureDate) - +new Date(b.departureDate)});
      //.sort(function(a, b) => {return this.compareFunction(a, b)});
      .sort(function (a, b) {
        console.log("Date a: ", a.departureDate, "Date b: ", b.departureDate, "Comparison #: ", +new Date(a.departureDate) - +new Date(b.departureDate));
        console.log(a.departureTime.localeCompare(b.departureTime));
        if (+new Date(a.departureDate) - +new Date(b.departureDate) != 0) {
          return +new Date(a.departureDate) - +new Date(b.departureDate);
        } else return a.departureTime.localeCompare(b.departureTime);
      })
      // .sort(function (a, b) {
      //   console.log(+new Date(a.departureDate) - +new Date(b.departureDate));
      //   console.log(new String(a.departureTime).localeCompare(new String (b.departureTime)));
      //   if (new String(a.departureTime).localeCompare(new String (b.departureTime)) != 0) {
      //     return (new String(a.departureTime).localeCompare(new String (b.departureTime)));
      //   } else return +new Date(a.departureDate) - +new Date(b.departureDate);
      // })
  }

  compareFunction(a: Ride, b: Ride): number {
    if (+new Date(a.departureDate) - +new Date(b.departureDate) != 0) {
      return +new Date(a.departureDate) - +new Date(b.departureDate);
    } else return (+new Date(a.departureDate) - +new Date(b.departureDate));
  }


  refreshRides(): Observable<Ride[]> {
    const rides: Observable<Ride[]> = this.rideListService.getRides();
    rides.subscribe(
      rides => {
        this.rides = rides;
        this.filterRides(this.rideDestination);
      },
      err => {
        console.log(err);
      });
    return rides;
  }

  refreshUsers(): Observable<User[]> {
    const users: Observable<User[]> = this.rideListService.getUsers();
    users.subscribe(
      users => {
        this.users = users;
      },
      err => {
        console.log(err);
      });
    return users;
  }

  loadService(): void {
    this.rideListService.getRides(this.rideDriving).subscribe(
      rides => {
        this.rides = rides;
        this.filteredRides = this.rides;
      },
      err => {
        console.log(err);
      }
    );
  }


  ngOnInit(): void {
    this.refreshRides();
    this.refreshUsers();
  }
}
