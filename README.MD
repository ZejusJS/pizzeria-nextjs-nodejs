# Mamma mia
first project with nextjs + nodejs

### To-do list:
- [x] ~~Completly rebuild auth with JWT for easier accessing basic info of user~~ - sessions are ok
- [x] Verify every request with Joi... check if user email is taken, req.body is complete, etc
- [x] Repair checkout page, so it will fetch cart from query
- [x] Build links in nav and style it
- [x] Do middlewares in backend for checking cart's user
- [x] ~~Calculate total price in CZK (maybe from someone's api)~~ - Prices only in CZK
- [x] Implement sandbox gateway (from ČSOB)
- [ ] Implement Google auth
- [x] Clear the ducking mess in the new-pizza's form validation code!!!!! 
- [x] Paginate pizzas
- [x] Style login and signup pages
- [x] User site for displaying and editing user's information, adress, orders etc
- [x] CSP in NextJS
- [ ] Admin page for all orders from users... in progress
- [x] Error message when bad order details in checkout
- [x] Finding pizza by name, ingredients and price
- [x] Pizza showcase move to another page and do new home page
- [x] Cancel GetServerSideProps in index
- [x] Repair payment/card in deployment
- [x] Repair qnt change
- [x] ~~Popup on cart~~
- [ ] Secure the checkout - no duplicates, tokens, [x]slowdown, [x]recaptcha... in progress
- [ ] twitter, facebook etc. seo... in progress
- [x] Single order page... in progress
- [x] Fix payment url in orders profile
- [ ] Calculate time of delivery to user's location (this will be pain)
- [ ] Restyle the footer (more information, longer)
- [ ] Complete landing page
- [ ] Show pizza by query params
- [x] Repair user site

### Links: (last deploy: 16.4.2023)
(long waiting for fresh starts, free tiers) <br>

<b>If there is a "This function has crashed" error or endless loading, 
it means that the server hasn't been started yet (server is on free plan, so it takes time)</b> <br>

- **Frontend**: https://pizzeria-mammamia.netlify.app/
- **Backend**: https://pizzeria-backend-4vij.onrender.com/ <br>
For admin POV use: email: "email@email.com" and password: "12345678"

### Stack:
1. NextJS
2. NodeJS
3. Express
4. MongoDB + Redis

<br>
<br>
I misspelled "address" multiple times and I'm too lazy to repair it :P
<br>
<br>