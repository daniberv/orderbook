# Orderbook Demo

![image](https://user-images.githubusercontent.com/34583263/235604076-a311be07-2f73-4f5f-94ad-0d4c75d4ec16.png)

### `yarn`

Install all the packages & dependencies.

### `yarn dev`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

```
JWT bearer token is required to connect. Please see the .env file and paste the correct one in case it is expired

VITE_WEBSOCKET_JWT=<bearer token>
```

### `yarn test`

Launches the test runner. Based on JEST library. Math, sorting, helpers methods are covered as well as the store.

### `yarn build` & `yarn preview`

Builds the app for production to the `build` folder and runs it in the production mode

### `yarn preview`

## Note

The app is built on Vite and Typescript with environment variables and aliases in order to keep structure more clean and easy-to-read. Even though OrderBook component is done isolated it can't be used without proper configuration.

So it's DEMO only structure.

I'd say it is a pseudo-isolated approach because the Orderbook exploits specific Websocket provider and operates specific data scheme

### Layers

The first challenge I faced was splitting the orderbook model with its state, logic AND the connection model. So that we have 2 stores for this. The tricky part is about handling the connection. Some logic from Orderbook store can fire the event that should affect Connection store. On top of that connection should be able to handle itself.

With this in mind I desided to create a context for connection. This allows to have the logic outside of Orderbook and Connection stores yet keep it reactive. Not really sure about it considering further scaling and any use cases but looks interesting.

Surely this structure can be improved. For example handling can be wrapped up in Handlers entity instead of useEffect in context.

### Orders

Computing the items based on incoming data is the essential part. Basically we have O(n) complexity and we can't get rid of it because every row in the orderbook has to be updated with the new bucket of data.

So the least we can do is to keep iterable methods as simple and fast as we can. Avoid `.map` & `.reduce`. That means more code and readability but also more perfomance.

```
Classic .map

export const transformTicksToNumber = (
	ticks: string[][]
): AsksType | BidsType => ticks.map((tick) => [parseFloat(tick[0]), parseFloat(tick[1])])
```

```
Optimized for loop

export const transformTicksToNumber = (
	ticks: string[][]
): AsksType | BidsType => {
	let result: AsksType | BidsType = []
	const ticksLen = ticks.length
	for (let i = 0; i < ticksLen; i++)
	result.push([parseFloat(ticks[i][0]), parseFloat(ticks[i][1])])

    return result
}
```

It is about from 1 to 6 orders per second the server sends according to my research. So the profit might not so big. Though this optimization will be 'a must' when this count is higher

### State management

Criteria for picking a state manager:

- Assuming the orderbook will be embedded into some mid/big size app
- Assuming the data size and load will be increasing
- Assuming the data structure might be crossed and updated

`MobX with State Tree` is one the best choice to me as it can be used to handle all criteria above. Plus it runs really smooth yet keeps all the data normalized (if we'll need it)

### UI components

Basically I used MUI framework because it has all the neccessary routine out of the box. `Styled Components` might become a bottleneck of performance so we need to keep an eye on it. Assuming the orderbook demo is not an agnostic thing MUI is a good option

The interesting part is how we split the UI-rendering components. We have to find some trade-off between simple structure and performance.

In order to use memoization I had to split some components like this:

```
First version of the high level component - <Content />

const Content = observer(() => {
	const { orderbook } = useStoreContext()

    const asks = orderbook.getAsks()
    const bids = orderbook.getBids()

    return (
    	<>
    		<Table type={OrderType.asks} rows={asks} />
    		<Styled.Divider />
    		<Table type={OrderType.bids} rows={bids} />
    	</>
    )

})
```

The plan was to use one `Table` for `Asks` and `Bids` because it's almost the same. But that approach kills memoization. So the final version contains `<Asks />` & `<Bids>` with its own data retrieving.

P.S. Nice interesting task
