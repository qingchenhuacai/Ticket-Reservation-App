/* This is the */
/* 
   This is the initial data for travellers, each traveller object contains attributes like id, name, gender, phone, bookingTime, and seatNumber.
*/
const initialTravellers = [
  {
    id: 1, 
    name: 'Jack', 
    gender: 'Male', 
    phone: 88885555, 
    bookingTime: new Date(),
    seatNumber: 1 
  },
  {
    id: 2, 
    name: 'Rose', 
    gender: 'Female', 
    phone: 88884444, 
    bookingTime: new Date(),
    seatNumber: 2 
  },
];

/* 
   This is the initial data for seats, each seat object contains attributes like id and reserved status.
*/
const initialSeats = [
  { id: 1, reserved: true },
  { id: 2, reserved: true },
  { id: 3, reserved: false },
  { id: 4, reserved: false },
  { id: 5, reserved: false },
  { id: 6, reserved: false },
  { id: 7, reserved: false },
  { id: 8, reserved: false },
  { id: 9, reserved: false },
  { id: 10, reserved: false },
];

/* 
   This is a functional component for rendering a seat. 
   It receives props including the reserved status of the seat and renders a colored box representing the seat.
*/
function Seat(props) {
  const { reserved } = props;
  const seatStyle = {
    width: '50px',
    height: '50px',
    margin: '5px',
    border: '1px solid #ccc',
    backgroundColor: reserved ? '#0F0' : '#FFA500',
  };
  return <div style={seatStyle}></div>;
}

/* 
   This is a functional component for rendering the seating chart. 
   It maps over the initialSeats array and renders a Seat component for each seat.
*/
function SeatingChart() {
  const seatComponents = initialSeats.map(seat => (
    <Seat key={seat.id} reserved={seat.reserved} />
  ));

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Seating Chart</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
        {seatComponents}
      </div>
    </div>
  );
}

/* 
   This is a functional component for rendering a single row of the table for a traveller. 
   It receives props including the traveller object and renders each attribute value in a table cell.
*/
function TravellerRow(props) {
  const { traveller } = props;
  return (
    <tr>
      <td>{traveller.id}</td>
      <td>{traveller.name}</td>
      <td>{traveller.gender}</td>
      <td>{traveller.phone}</td>
      <td>{traveller.bookingTime.toString()}</td>
      <td>{traveller.seatNumber}</td>
    </tr>
  );
}

/* 
   This is a functional component for rendering the table displaying travellers. 
   It maps over the travellers array passed as props and renders a TravellerRow component for each traveller.
*/
function Display(props) {
  const travellerRows = props.travellers.map(traveller =>
    <TravellerRow key={traveller.id} traveller={traveller} />
  );

  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Booking Time</th>
          <th>Seat Number</th>
        </tr>
      </thead>
      <tbody>
        {travellerRows}
      </tbody>
    </table>
  );
}

/* 
   This is a class component for adding a traveller. 
   It contains a form for entering passenger details and handles form submission to add a new traveller.
*/
class Add extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const name = e.target.travellername.value;
    if (!name.trim()) {
      alert("Name cannot be empty!");
      return; 
    }
    const phone = e.target.travellerphone.value;
    if (!phone.trim()) {
      alert("Phone cannot be empty!");
      return; 
    }
    const seatNumber = parseInt(e.target.seat.value);
    const gender = e.target.gender.value;
    const id = this.props.nextId;
    const bookingTime = new Date();
    const newTraveller = { id, name, phone, bookingTime, seatNumber, gender }; 
    this.props.bookTraveller(newTraveller);
  }

  render() {
    return (
      <form name="addTraveller" onSubmit={this.handleSubmit}>
        <input type="text" name="travellername" placeholder="Name" />
        <input type="text" name="travellerphone" placeholder="Phone" />
        <select name="seat">
          {initialSeats.filter(seat => !seat.reserved).map(seat => (
            <option key={seat.id} value={seat.id}>{seat.id}</option>
          ))}
        </select>
        <select name="gender">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button>Add</button>
      </form>
    );
  }
}

/* 
   This is a class component for deleting a traveller. 
   It contains a form for selecting a passenger to delete and handles form submission to delete the selected traveller.
*/
class Delete extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const name = e.target.travellername.value;
    this.props.deleteTraveller(name);
  }

  render() {
    return (
      <form name="deleteTraveller" onSubmit={this.handleSubmit}>
        <select name="travellername">
          {this.props.travellers.map(traveller => (
            <option key={traveller.id} value={traveller.name}>{traveller.name}</option>
          ))}
        </select>
        <button>Delete</button>
      </form>
    );
  }
}

/* 
   This is a class component for the homepage. 
   It renders a welcome message and the SeatingChart component.
*/
class Homepage extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Welcome to Ticket To Ride</h2>
        <SeatingChart /> 
      </div>
    );
  }
}

/* 
   This is a class component for the main TicketToRide application. 
   It manages the state including travellers, selector, availableSeats, and nextId. 
   It also contains methods for adding and deleting travellers.
*/
class TicketToRide extends React.Component {
  constructor() {
    super();
    this.state = { 
      travellers: initialTravellers, 
      selector: 1, 
      availableSeats: initialSeats.filter(seat => !seat.reserved).length,
      nextId: initialTravellers.length + 1 
    };
    this.bookTraveller = this.bookTraveller.bind(this);
    this.deleteTraveller = this.deleteTraveller.bind(this);
  }

  setSelector(value) {
    this.setState({ selector: value });
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    setTimeout(() => {
      this.setState({ travellers: initialTravellers });
    }, 500);
  }

  bookTraveller(passenger) {
    if (this.state.availableSeats === 0) {
      alert("All seats are booked. Cannot add more passengers.");
      return;
    }

    initialSeats[passenger.seatNumber - 1].reserved = true;
    passenger.id = this.state.nextId;
    this.setState(prevState => ({
      travellers: [...prevState.travellers, passenger],
      availableSeats: prevState.availableSeats - 1,
      nextId: prevState.nextId + 1
    }));
  }

  deleteTraveller(passengerName) {
    const deletedTraveller = this.state.travellers.find(traveller => traveller.name === passengerName);
    if (deletedTraveller) {
      initialSeats[deletedTraveller.seatNumber - 1].reserved = false;

      this.setState(prevState => ({
        travellers: prevState.travellers.filter(traveller => traveller.name !== passengerName),
        availableSeats: prevState.availableSeats + 1
      }));
    }
  }

  render() {
    const buttonStyle = {
      margin: '0 10px',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#28a745',
      color: '#fff',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    };

    return (
      <div>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Ticket To Ride</h1>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button style={buttonStyle} onClick={() => this.setSelector(1)}>Homepage</button>
          <button style={buttonStyle} onClick={() => this.setSelector(2)}>Add Traveller</button>
          <button style={buttonStyle} onClick={() => this.setSelector(3)}>Delete Traveller</button>
          <button style={buttonStyle} onClick={() => this.setSelector(4)}>Display Travellers</button>
        </div>
        <div>
          {this.state.selector === 1 && <Homepage />}
          {this.state.selector === 4 && <Display travellers={this.state.travellers} />}
          {this.state.selector === 2 && <Add bookTraveller={this.bookTraveller} />}
          {this.state.selector === 3 && <Delete deleteTraveller={this.deleteTraveller} travellers={this.state.travellers} />}
        </div>
      </div>
    );
  }
}

const element = <TicketToRide />;

ReactDOM.render(element, document.getElementById('contents'));



