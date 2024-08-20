
# [AIHeadshots](https://github.com/coenhewes/AIHeadshots) - professional headshot pics with AI


## How it works

It uses a custom ML model called [tencentarc/photomaker](https://replicate.com/tencentarc/photomaker) used to generate variations headshot pics. This application gives you the ability to upload a photo of any face, which will send it through this ML Model using a Next.js API route, and return your generated professional headshot. The ML Model is hosted on [Replicate](https://replicate.com) and [Bytescale](https://www.bytescale.com/) is used for image storage.

## Running Locally

### Cloning the repository the local machine.

```bash
git clone https://github.com/coenhewes/AIHeadshots.git
```

### Creating a account on Replicate to get an API key.

1. Go to [Replicate](https://replicate.com/) to make an account.
2. Click on your profile picture in the top left corner, and click on "API Tokens".
3. Here you can find your API token. Copy it.

### Storing the API keys in .env

Create a file in root directory of project with env. And store your API key in it, as shown in the .example.env file.

If you'd also like to do rate limiting, create an account on UpStash, create a Redis database, and populate the two environment variables in `.env` as well. If you don't want to do rate limiting, you don't need to make any changes.


### ENV Variables

REPLICATE_API_TOKEN={your_replicate_url}
NEXT_PUBLIC_UPLOAD_API_KEY={your_bytescale_api}
VERCEL_URL=https://{your_vercel_url}

### Installing the dependencies.

```bash
npm install
```

### Running the application.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
npm run dev
```

