import { extractTopColor } from '@/modules/colourDetection';
import { take } from 'lodash';
// const extractColor = require('./modules/colourDetection/colourExtracter.js').getColorPalete;

// const img = path.resolve(process.cwd(), 'nature-stone.png');
// data:image/png;base64,
const img = 'iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX///8AAACrq6uSkpL4+Pjp6emYmJiFhYXc3NzQ0NBycnJQUFB8fHwmJiY9PT1iYmJVVVVhYWHW1tb09PTt7e3h4eHHx8eLi4s4ODhKSkqwsLDAwMBvb29FRUUODg4bGxswMDChoaEyMjK5ubkMDAzCkrd1AAAD5UlEQVR4nO3d63aqMBCG4URBRUAQFRTPtfd/jTui7UYEz1nTb5i3v7s6z4JCY5UozT1FPYD1RIifCPETIX4ixE+E+IkQPxHiJ0L8HhCGfj9fpt6xZFA0c3+aOPWp+zV857mpW252+rmDpJgiTdPl4ZDnne5qvXlXOO8vZw9MS5fjZevXhWF38MjBIG+QhS8J45R68idaNh/IJmE0oB76yZLxU8I4oR74hTz/YeHmQD3si+UPClcQl5faJtEjwg71mG/VuSsMEX8DyyXVO0dFOJ9ST/h209EtYUw93keKm4Ux7jWmnBM1CZkA1eVRLAm3bIDK2dUKXeq5Pth0WyNcUk/10bxrYZ96pg/Xqwrn1BN9PL8iRFss3c+9FAbU81ioVxZuJtTjWMgJS8I99TRWyv8LQz73+ovmv0Keh/C8WCyETA+hUj/CIfUg1uqehejL+uZmJ+GOeg6LLQphl3oMi+0LId+TtDhNld6xvZIeGxlhRD2E1YZGyPV2fyo3Qo96CKslRvi3/8f7blOtWC6cSm3NF+9C88W7HXvhlzHybqT4vYx42doYeecbI+9iY+Rd1ALhmHoEy60U78WTWT6xP4ZD9scwUHxfLD3VFyF8fcXxf6PluorbOxSq9UQInwjx66mMegTL7Y2Rdx0RwtcGIfbHK+4nQvxEiJ8I8RMhfiLET4T4iRA/EeInQvxEiJ8I8RMhfiLET4T4iRA/EeInQvxEiJ8I8RMhfiLET4T4iRA/EeInQvxEiJ8I8RMhfiLET4T4dRTvxya249N5IkSvDUL+n8cXIXoixK8NQu5PUcpa8CQsEaLXZ/9UQXkyJH5DxWPr0eZW7J+yO26BkPvTrv0WPLH8i3oEy43Y7xwwb8HuD9yFO8VoJ+faQqXx94u/lbNRDPfJLTfTitlu1dU8I+T9UlTXCHkvLsbH/Q85X2omm6PwQD2GxdJiD0vOr0UFp71kGd/zNych39M0Pe8HzHeZP/7ZtZrrnzXu777cK+pRLBX8Cpnu1DnV/4U8D2JQErLc13mgy8IF9TgWii+EDPc9zvWlkN3FxtVV4YLZ327xlVDzestCpq+FmtO7hQ+6TqhT6rk+lqfrhWy2WU90k5AJcfDdLGRxonqXpIqQweUm17eF8DeNrAq6Euq5Sz3kG7nrK8+1EPlMrZ6hTUK9wLymJn4dplao9RDvVHWDekqD0BixFhvusAnSKNQ6Xk6o534wZzluZtwQar0dpn9/TeWkQXgLcVNo+l7svb+rdLy9v7kjuCc8F458P4pWwbGsS1dWTLCKIt8f3TxyTwuBEyF+IsRPhPiJED8R4idC/ESInwjx+wdd0T+zPjDdKgAAAABJRU5ErkJggg==';

  extractTopColor(img).then((result) => {
    const top5Colors = take(result, 5);
    const totalColor = top5Colors.reduce((total, item) => total + Object.values(item)[0], 0);

    const final = top5Colors.map((color) => {
      const [colorHex, density] = Object.entries(color)[0];
      return {
        color: colorHex,
        density,
        percentage: (density / totalColor) * 100
      }
    })
    console.log('final', final);
  });
