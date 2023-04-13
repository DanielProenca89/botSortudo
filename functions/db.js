import  sqlite3 from 'sqlite3';
import {config} from 'dotenv'
const fs = require('fs')

const installed = false
const db = new sqlite3.Database('db');


db.query = function (sql, params = []) {
    const that = this;
    return new Promise(function (resolve, reject) {
      that.all(sql, params, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };




class dataBase{


install(){

if (installed == false)


db.serialize(() => {
    db.run("CREATE TABLE session (sessionId varchar(100), name text, wf int, start_ts timestamp, status text)");

    

  
});



//process.env.installed = true
config()

}




newSession(sessionId, name, wf, status) {

    const start_ts = Date.now()

    const stmt = db.prepare("INSERT INTO session VALUES (?,?,?,?,?)");
    
    stmt.run(sessionId, name, wf, start_ts, status);
    
    stmt.finalize();
    
}

UpWf(sessionId) {

  const start_ts = Date.now()

  const stmt = db.prepare("update session set wf = wf + 1 where sessionId = ?");
  
  stmt.run(sessionId);
  
  stmt.finalize();
  
}

async getSession(sessionId){

        // assemble sql statement
        const sql = `
            SELECT name
            FROM session
            WHERE sessionId = ?;
          `;
        const result =  await db.query(sql, [sessionId]);

        console.log(result)
      
        return result
    

   }

   async getWorkFlow(sessionId){

    // assemble sql statement
    const sql = `
        SELECT wf
        FROM session
        WHERE sessionId = ?;
      `;
    const result =  await db.query(sql, sessionId);
    

    console.log(result[0].wf)
  
    return result[0].wf


}

   

}



const dba = new dataBase;

module.exports = dba;