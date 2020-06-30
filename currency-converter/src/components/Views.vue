<template>
  <div>
    <div id="history" v-if="showHistory" >
      <button @click="toggleHistory"> Go back</button>
        <table>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
          </tr>
          <tr v-for="(data, index) in History" :key="index">
            <td>{{data.createdAt | formatDate }}</td>
            <td>{{data.from}}</td>
            <td>{{data.to}}</td>
          </tr>
        </table>
    </div>
    <div v-else id="curCalculator">
      <button @click="toggleHistory"> View History</button>
    <section id="upperPart">
      <header>Pickar</header>
       
      <p>Convert currencies in real time.</p>
    </section>
    <section id="inputSection">
     
      <form action="" @submit.prevent>
        <input class="inputEl" v-model="currency.amount" type="number" id="curAdd">
        <select class="inputEl" v-model="currency.fromCur" name="from" id="fromCur">
          <option value="" disabled>Select a Currency</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CHF">CHF</option>
        </select>

        <select class="inputEl" v-if="currency.fromCur != 'USD'" v-model="currency.toCur" name="to" id="toCur">
          <option value="" disabled>Select a Currency</option>
          <option value="USD">USD</option>
        </select>

        <select class="inputEl" v-else-if="currency.fromCur == 'USD'" v-model="currency.toCur" name="to" id="toCur">
          <option value="" disabled>Select a Currency</option>
          <option value="EUR">EUR</option>
          <option value="CHF">CHF</option>
        </select>

        <button class="inputEl" @click="convertCurrency" type="submit"> Convert</button>
      </form>
       <transition >
          <div v-if="showError" >
              <p>
                  {{ err.message }}
              </p>
          </div>
      </transition>
            <div v-if="currency.result != ''" >
            {{currency.amount}} {{currency.fromCur}}  = 
              <p id="result">{{ currency.result }} in {{ currency.toCur}}</p>
            </div>
    </section>
    <section id="downPart">
      
    </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  data() {
    return {
      currency: {
        amount: '',
        fromCur: '',
        toCur: '',
        result: ''
      },
      showHistory: false,
      showError: false,
      History: [],
      err: {
        message: ''
      }
    };
  },
  methods: {
    async convertCurrency(){

      if(this.currency.toCur == '' || this.currency.toCur == '' || this.currency.amount == '' ||  parseInt(this.currency.amount) < 0 ){
        this.showError = true;
        this.err.message = 'Please fill all inputs before submits'

        setTimeout(()=>{
            this.showError = false;
            this.err.message = ''
        }, 2000)
      }
    else {      
      let baseUrl = 'http://api.currencylayer.com/',
         endpoint = 'live',
         key = 'dd3189328ec7a3f969f1736011733d53';
     let query = `${baseUrl}${endpoint}?access_key=${key}`;
     let {data} = await axios.get(query);

     if(this.currency.fromCur == "USD"){
       let symbol = this.currency.fromCur + this.currency.toCur 
       let convertionRate = data.quotes[symbol];
        // console.log(this.History)
       this.currency.result = parseInt(this.currency.amount)*convertionRate;
       this.saveHistory()
       axios.get('http://localhost:4000/all')
       .then((curdata)=>{
         this.History = curdata.data;
           console.log(curdata.data)
       });
     }
     else if(this.currency.fromCur != "USD"){
       let symbol = this.currency.toCur + this.currency.fromCur;
       let convertionRate = data.quotes[symbol];
        console.log(this.History)
       this.currency.result = parseInt(this.currency.amount)/convertionRate;
       this.saveHistory()
       axios.get('http://localhost:4000/all')
       .then((curdata)=>{
         this.History = curdata.data;
           console.log(curdata.data)
       });
       
     }
    }
   },
   toggleHistory(){
     this.showHistory = !this.showHistory;
   },
   async saveHistory(){
      let from = `${this.currency.amount}${this.currency.fromCur}`;
      let to = `${this.currency.result}${this.currency.toCur}`;
      let URL = 'http://localhost:4000/data'
      await axios.post(URL,{from,to})
   },
   async getAllHistory(){
      axios.get('http://localhost:4000/all')
       .then((curdata)=>{
         this.History = curdata.data;
           console.log(curdata.data)
       });
   }
  },
  filters: {
    formatDate(val) {
      if (!val) { return '-'; }
      val = val.split('T')
      return val[0];
    },
  },
 beforeMount(){
    this.getAllHistory()
 }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#upperPart{
  margin-top: -7%;
  background-color: #000;
  height: 50%;
}
#inputSection{
  position: absolute;
  left: 10%;
  top: 39%;
  height: 100px;
  background-color: cornsilk;
  align-content: center;
  z-index: 9999999;
  border-radius: 10px;
  
}
.inputEl{
  margin: 32px 10px 23px 10px;
  z-index: 9999999;
}
#upperPart header{
  padding-top: 2rem;
  margin-left: 4rem;
  text-align: left;
  color: #fff;
  z-index: 999;
}
 #upperPart p{
  margin-top: 5rem;
  color: #fff;
  z-index: 999;
}
#downPart{
  background-color: mediumturquoise;
  height: 50%;
}

#curCalculator{
  height: 100vh;
}
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
tr:hover {background-color:#f5f5f5;}

</style>
