# Smart Split Bill + Tip Calculator 💸                                                             
                                                                                                       
    A premium, fast, and 100% free web application to help you split bills, calculate tips and taxes,  
  and instantly see how much each person owes. Built with modern web standards and designed for a      
  mobile-first experience.                                                                             
                                                                                                       
    ## ✨ Key Features                                                                                 
                                                                                                       
    - **Real-Time Calculations:** View your subtotal, tax, tip amount, and individual splits update    
  instantly as you type.                                                                               
    - **Multi-Currency Support:** Automatically fetches live exchange rates via `open.er-api.com`.     
  Select your "Base Currency" (what the bill is in) and your "Convert To" currency (what you want to   
  pay in). Fails gracefully to offline fallback rates if the API is unreachable.                       
    - **Smart Tip Engine:** Quick 1-click buttons for 0%, 5%, 10%, 15%, 20%, alongside a dynamic custom
  tip input percentage.                                                                                
    - **Intelligent Rounding:** An optional toggle to round the per-person amount UP to the nearest    
  whole number. The underlying math automatically adjusts the final total and tip amounts so everything
  balances perfectly.                                                                                  
    - **1-Click Copy:** Easily copy a beautifully formatted text summary of the split to your clipboard
  to paste into WhatsApp, iMessage, or Splitwise.                                                      
    - **Premium UI/UX:** Dark mode aesthetic utilizing custom glassmorphism design cues, smooth        
  typography (Inter font), and responsive CSS grid layouts.                                            
    - **Zero Cost & Open:** No subscriptions, no ads, no API limits.                                   
                                                                                                       
    ## 🚀 Tech Stack                                                                                   
                                                                                                       
    - **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)                      
    - **Language:** [TypeScript](https://www.typescriptlang.org/) for strict type safety and cleaner   
  logic.                                                                                               
    - **Styling:** Vanilla CSS (CSS Variables, Grid, Flexbox) — no heavy UI frameworks required,       
  ensuring maximum speed.                                                                              
    - **Icons:** [Lucide React](https://lucide.dev/) for crisp, scalable SVG icons.                    
    - **Deployment:** Ready out-of-the-box for [Vercel](https://vercel.com/) (Free Tier).              
                                                                                                       
    ## 🧠 How the Logic Works                                                                          
                                                                                                       
    The core math resides in `src/App.tsx`.                                                            
    1. The app takes the base `Bill Amount` and `Tax/Service Charge`.                                  
    2. It calculates the `Tip Amount` based on the selected percentage (or custom input).              
    3. It determines the `Total Amount` and divides it by the `Number of People`.                      
    4. If **Rounding** is enabled, it uses `Math.ceil()` on the per-person amount, recalculates the new
  `Total Amount`, and adjusts the `Tip Amount` upward so the math remains flawlessly balanced.         
    5. Finally, if the target currency differs from the base currency, all final values are multiplied 
  by the fetched exchange rates before rendering.                                                      
                                                                                                       
    ## 🛠️ How to run locally                                                                           
                                                                                                       
    1. **Clone the repository**                                                                        
       ```bash                                                                                         
       git clone https://github.com/YOUR_USERNAME/smart-split-calculator.git                           
       cd smart-split-calculator                                                                       
                                                                                                       
  2. Install dependencies                                                                              
    npm install                                                                                        
                                                                                                       
  3. Start the development server                                                                      
    npm run dev                                                                                        
    Open your browser and navigate to  http://localhost:5173 .                                         
                                                                                                       
  ## 📦 Deployment on Vercel                                                                           
                                                                                                       
  This project is built to be deployed seamlessly on Vercel.                                           
                                                                                                       
  1. Log in to Vercel https://vercel.com/ and click Add New Project.                                   
  2. Connect your GitHub account and select this repository.                                           
  3. Vercel will automatically detect the Vite preset.                                                 
  4. Click Deploy. No additional environment variables are required!                                   
  ──────                                                                                               
  Built for the Digital Heroes trial.    
