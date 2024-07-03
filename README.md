![Candid Image](./candid.png)

# validator-service

validator-service is a Node application for candid, the engineering steps can be found on this docs [Candid-Engineering-Docs](https://docs.google.com/document/d/12HLb40CLwV3LVKaKv_fFac6-IKoSEal7e1zTKrGU0yA/edit#heading=h.70aj67ugiq40)


## Concepts

More information on this can be found on the engineering docs, present at [Candid-Engineering-Docs](https://docs.google.com/document/d/12HLb40CLwV3LVKaKv_fFac6-IKoSEal7e1zTKrGU0yA/edit#heading=h.70aj67ugiq40) and the technologies involved includes: `Nodejs`, `npm`, `PG Database`, `Prisma CLI` and `Expressjs`

## Run the application 

Currently, we can run the app using Docker or through by just using common node commands, in the first step, we'd be exploring how to run the validator-service using docker, then in the second step, i'd show how to use common node commands to run the dev server

### 1. *Using Docker:*
   NB: Make sure you have docker installed on your computer, before executing the commands please

```
docker build -t candid .
```

To run with docker, firstly, have all the env variables in `.env` and `.env.dev` file in our project root. but considering the fact that the only env variable is the port, this docs would constantly change to fit in new adjustments 

Then, build the project -

```
docker run -p 3000:3000 candid
```

As mentioned earlier, you will need docker installed in your computer. For help with installation, ask in slack.


### 2. Without using Docker:

For this to work, make sure you've nodejs => 18.x installed on your system, before running the following comands

```
npm install
```

After Successful installation of the packages needed for the project to run, make sure to run the dev version using 

```
npm run dev
```


#### Support and Maintainance

Kindly reach me [peter](mailto:peter@linkedtrust.us) or Omah Salah or Kholoud, etc via email or through slack for quicker response 
