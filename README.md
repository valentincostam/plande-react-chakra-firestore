# Plande

Keep track of your college degree progress.

[plande.app](https://plande.app
)
## 📜 Description

<img align="right" width="200" src="plande-demo.gif" style="margin-left: 20px; margin-bottom: 20px;">

Plande is your college degree curriculum made simple and interactive.

By letting you mark whether you have passed your degree's courses, it helps you to:

- 📏 Measure your progress toward degree completion.
- 🧮 Know what courses you can attend, your current weekly classload, the number of passed courses, and other stats.
- 📅 Plan and organize yourself ahead of time by allowing you to simulate possible scenarios.
- 💪 Motivate yourself by showing you how far got and how much is left.
- 🫂 Share your achievements with non-academic people by having a minimalist and user-friendly interface.
- 📱 Have the curriculum and your progress everywhere at anytime. 

Instead of dealing with traditional curriculum tables (like [this one](http://www.frcu.utn.edu.ar/wp-content/uploads/2018/07/Plan_ISI_2015.pdf) and [this other one](https://fcytcdelu.uader.edu.ar/sistemas)) and getting frustrated for trying to understand them, just use [Plande](https://plande.com) and enjoy.

For those who know me, think of Plande as the modern version of [isi](https://valentincosta.com/isi/), simpler, faster, that can save your progress in the cloud and support other college degrees.

## ⚒️ Built with 

- [React](https://reactjs.org/docs/getting-started.html) - A JavaScript library for building user interfaces
- [Next.js](https://nextjs.org/docs/getting-started) - The React framework
for production
- [Chakra UI](https://chakra-ui.com/docs/getting-started) - Simple, modular and accessible component library
- [Firebase Authentication](https://firebase.google.com/docs/auth) - Simple, free
multi-platform sign-in
- [Cloud Firestore](https://firebase.google.com/docs/firestore) - NoSQL database built for global apps
- [Vercel](https://vercel.com/docs) - Platform for frontend frameworks and static sites

## 🤔 Frequently Asked Questions

<details>
  <summary><strong>What motivated you to build this app?</strong></summary>

  Back when I was in college, I always found my degree curriculum confusing. Looking at it, it was unclear what courses I could attend after passing others. I had to carefully follow a bunch of numbers (course codes) and double-check that I wasn't mistaken. And I knew that my fellow students experienced the same. So I thought there should be a better way to go through this process and that a web app could be the solution.

  Months later, I released [isi](https://github.com/valentincostam/isi). You can watch a talk I give about it (in Spanish) on [YouTube](https://www.youtube.com/watch?v=twdmSBxbmp8), where I share a little more about the problem and my experience building it.

  On top of that, it was a great excuse to learn technologies I find interesting. It shows how much I love to build things as well.
</details>

<details>
  <summary><strong>Why did you choose that stack?</strong></summary>
  
  Mostly because I wanted to learn those technologies. As they're really popular, there are ton of resources for learning and troubleshooting, which is always good.

  Also, since degrees curriculums doesn't change that often, it made sense to me to learn about a SSG (Static Site Generator) like Next.js.

  What do you think? What stack would you have chosen? [Let me know!](https://twitter.com/valentincostam)
</details>

<details>
  <summary><strong>Who is Plande built for?</strong></summary>
  
  It's for every student attending some of the colleges supported by the app.
</details>

<details>
  <summary><strong>What colleges does it support?</strong></summary>
  
  At the moment, Plande has been developed (but not tested) to support [UTN FRCU](https://www.frcu.utn.edu.ar/), [UADER FCyT](https://fcytcdelu.uader.edu.ar/), [UCU FAU](https://ucu.edu.ar/fau/), and any other college whose curriculums are like those from the mentioned colleges.
  
  Eventually, more will be supported, but it's not a priority right now.
</details>

<details>
  <summary><strong>Why are code and docs in English but the UI texts in Spanish? Does Plande have i18n support?</strong></summary>
  
  Because English is a universal language and I want to improve my communication skill with it (and you should probably do it too), but the app is intended for Spanish-speaking colleges.
  
  And no, it doesn't have i18n support yet.
</details>

## 💻 Running the project locally

### Requirement

- [Node.js 12.22.0](https://nodejs.org/en/) or later

### Steps

1. [Fork this repository and clone your fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

    ```
    git clone https://github.com/<your-username>/plande.git
    ``` 

2. Set up Firebase:

    1. [Create a Firebase project](https://firebase.google.com/docs/web/setup#create-project) and [register a new web app](https://firebase.google.com/docs/web/setup#register-app).
    2. [Generate a new private key file for the Firebase Admin SDK](https://firebase.google.com/docs/admin/setup#initialize-sdk).
    3. [Enable Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin#before_you_begin) in the Firebase console.
    4. [Create a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart#create) (in _Test mode_ or use the rules in the `firestore.rules` file.)

3. Copy the `API_KEY`, `AUTH_DOMAIN` and `PROJECT_ID` values from the [Firebase Web SDK config object](https://firebase.google.com/docs/web/learn-more#config-object) and paste them in the `.env.template` file.

4. Copy the `PRIVATE_KEY` (*) and `CLIENT_EMAIL` values from the Firebase Admin SDK private key JSON file and paste them in the `.env.template` file.
    > ⚠️ Keep the quotes (`"`) and line breaks (`\n`) in the `PRIVATE_KEY`. Don't remove them.

5. Rename the `.env.template` file to `.env.local`.

6. Install the project dependencies.

    ```bash
    yarn install # or npm install
    ```

7. Start the application in development mode.

    ```bash
    yarn dev # or npm run dev
    ```

8. Go to http://localhost:3000 in your browser.

### Make yourself administrator

In order to add new _universities_, _colleges_, _degrees_ and _subjects_ to Plande, you need to be an **admin** user.

1. Enter to Plande (http://localhost:3000) and log in with your Google account.
2. On the [Firebase console](https://console.firebase.google.com/), go to your Firestore database.
3. Select the `users` collection and then your user document (surely the only existing one).
4. Change the value of the `role` field from `student` to `admin`.
5. Go back to Plande (http://localhost:3000) and reload the page.

Now you should see a menu button in the top left corner, next to the Plande "logo". From there, you can access to the pages for adding new _universities_, _colleges_, _degrees_ and _subjects_.

## 🤝 Contributing

Contributions, issues and feature requests are welcome. Feel free to check [issues](https://github.com/valentincostam/plande/issues) page if you want to contribute.

And, of course, you can help with code:

1. [Fork this repository and clone your fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

    ```
    git clone https://github.com/<your-username>/plande.git
    ```

2. Create your feature/fix branch.

    ```
    git checkout -b my-new-feature
    ```

3. Commit your changes.

    ```
    git commit -am 'Add some feature'
    ```

4. Push to the branch.

    ```
    git push origin my-new-feature
    ```

5. Submit a [pull request](https://github.com/valentincostam/plande/pulls).

## 📝 License

[MIT](https://github.com/valentincostam/plande/blob/main/LICENSE) © [Valentín Costa](https://twitter.com/valentincostam)