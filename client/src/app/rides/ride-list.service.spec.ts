import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Ride} from "./ride";
import {RideListService} from "./ride-list.service";
import {User} from "../users/user";

describe( 'Ride list service: ', () => {
  const testRides: Ride[] = [
    {
      driver: 'Hagrid',
      destination: 'Hogwarts',
      origin: '4 Privet Drive',
      roundTrip: true,
      departureDate: '03/13/2019',
      departureTime: '5:00',
      driving: false,
      notes: 'I will be arriving in a flying motorcycle'
    },
    {
      driver: 'Lucy',
      destination: 'Narnia',
      origin: 'Wardrobe',
      roundTrip: true,
      departureDate: '03/19/2019',
      departureTime: '9:00',
      driving: true,
      notes: 'Dress for cold'
    },
    {
      driver: 'Student',
      destination: 'Morris',
      origin: 'The Outside',
      roundTrip: false,
      departureDate: '04/01/2019',
      departureTime: '12:00',
      driving: true,
      notes: 'There is no escaping Morris'
    }
  ];
  const testUsers: User[] = [
  {
    "_id": {
      "$oid": "5ca243f0ef2bf9b410bb5672"
    },
    "name": "Rosario Shaffer",
      "email": "Venoflex19@gmail.com",
      "phoneNumber": "(928) 480-3646"
  },
  {
    "_id": {
      "$oid": "5ca243f0662128b361c92055"
    },
    "name": "Trina Ramsey",
    "email": "Isologia30@hotmail.com",
    "phoneNumber": "(963) 498-3516"
  },
  {
    "_id": {
      "$oid": "5ca243f0daa0cc10e6f90b76"
    },
    "name": "Elvira Wiley",
    "email": "Musaphics29@yahoo.com",
    "phoneNumber": "(904) 578-2784"
  },
  {
    "_id": {
      "$oid": "5ca243f0797d9e845106b25e"
    },
    "name": "Hatfield Daniels",
    "email": "Extragen25@gmail.com",
    "phoneNumber": "(830) 410-3952"
  }];
  const trueRides: Ride[] = testRides.filter(ride =>
    ride.driving == true
  );

  const falseRides: Ride[] = testRides.filter( ride =>
    ride.driving == false
  );

  const emptyRides: Ride[] = testRides.filter( ride=>
    ride.driving.toString() == ''
  );

  let rideListService: RideListService;
  //let searchUrl: string;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;


  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    rideListService = new RideListService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  //Todo: Test getUsers()
  //Please ask Nic / KK
  /*
  it('can get Users', () => {
    console.log(rideListService);
    rideListService.getUsers().subscribe(
      users => expect(users).toBe(testUsers)
    );
    const req = httpTestingController.expectOne(rideListService.baseUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(testUsers);
  });
  */
  it('getRides() calls api/rides', () => {
    rideListService.getRides().subscribe(
      rides => expect(rides).toBe(testRides)
    );

    const req = httpTestingController.expectOne(rideListService.baseUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(testRides);
  });

  it('getRides(rideDriving) adds appropriate param string to called URL', () => {
    rideListService.getRides('true').subscribe(
      rides => expect(rides).toEqual(trueRides)
    );

    const req = httpTestingController.expectOne(rideListService.baseUrl + '?driving=true&');
    expect(req.request.method).toEqual('GET');
    req.flush(trueRides);
  });

  it('getRides(rideDriving) removes param', () => {
    rideListService.getRides('true').subscribe(
      rides => expect(rides).toEqual(trueRides)
    );

    const req = httpTestingController.expectOne(rideListService.baseUrl + '?driving=true&');
    expect(req.request.method).toEqual('GET');
    req.flush(trueRides);


    // TODO: Potentially look into and see if similar to the MatDialogConfig<any> error
    rideListService.getRides('false').subscribe(
      rides => expect(rides).toEqual(falseRides)
    );

    const req2 = httpTestingController.expectOne(rideListService.baseUrl + '?driving=false&');
    expect(req2.request.method).toEqual('GET');
    req2.flush(falseRides);

    // rideListService.getRides('').subscribe(
    //   rides => expect(rides).toEqual(emptyRides)
    // );
  });


  it('adding a ride calls api/rides/new', () => {
    const teacherDestination = 'St. Cloud';
    const newRide: Ride = {
      driver: 'Teacher',
      destination: 'St. Cloud',
      origin: 'Becker',
      roundTrip: false,
      departureDate: 'March 18th, 2019',
      departureTime: 'August',
      notes: 'There is no escaping Morris'
    };

    rideListService.addNewRide(newRide).subscribe(
      destination => {
        expect(destination).toBe(teacherDestination);
      }
    );

    const expectedUrl: string = rideListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(teacherDestination);
  });

  it('getRideByDestination() calls api/rides/destination', () => {
    const targetRide: Ride = testRides[1];
    const targetDestination: string = targetRide.destination;
    rideListService.getRideByDestination(targetDestination).subscribe(
      ride => expect(ride).toBe(targetRide)
    );

    const expectedUrl: string = rideListService.baseUrl + '/' + targetDestination;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetRide);
  });

  it('editing a ride calls api/rides/update', () => {
    const editedTeacherDestination = 'editedTeacherDestination';
    const editedRide: Ride = {
      driver: 'Teacher',
      destination: 'Morris',
      origin: 'Home',
      roundTrip: false,
      departureDate: 'March 18th, 2019',
      departureTime: 'Year Round',
      notes: 'There is no escaping Morris'
    };

    rideListService.editRide(editedRide).subscribe(
      destination => {
        expect(destination).toBe(editedTeacherDestination);
      }
    );

    const expectedUrl: string = rideListService.baseUrl + '/update';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(editedTeacherDestination);
  });


  it('deleting a ride calls api/rides/remove', () => {
    const deletedTeacherDestination = 'deletedTeacherDestination';
    const deletedRide: Ride = {
      _id: {
        oid: 'gobbldygook'
      },
      driver: 'Teacher',
      destination: 'Office',
      origin: 'Lab',
      roundTrip: false,
      departureDate: 'March 18th, 2019',
      departureTime: 'never',
      notes: 'There is no escaping the lab'
    };

    rideListService.deleteRide(deletedRide._id.toString()).subscribe(
      destination => {
        expect(destination).toBe(deletedTeacherDestination);
      }
    );

    const expectedUrl: string = rideListService.baseUrl + '/remove';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(deletedTeacherDestination);
  });

});
