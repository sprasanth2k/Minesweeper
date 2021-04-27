if(localStorage.getItem('High Score') == null)
{
    localStorage.setItem('High Score',0)
}

var difficulty , n = 10 , cells_remaining,mytimer,flag=true;
var a = new Array(n);
var f = new Array(n);
for(let i=0;i<n;i++)
{
    a[i] = new Array(n);
    f[i] = new Array(n);
    for(let j=0;j<n;j++)
    {
        a[i][j] = 0;
        f[i][j] = 1;
    }
}

createTable()
function createTable()
{
    document.querySelector('.high-score').innerHTML = 'High Score: '+localStorage.getItem('High Score')
    let i,j;
    table=document.querySelector('.minesweeper-grid');
    for(i=0;i<n;i++)
    {
        for(j=0;j<n;j++)
        {
            div = document.createElement('div');
            div.id = i+''+j;
            div.className = 'grid-cell';
            div.setAttribute('onClick','displayCell(event)');
            div.setAttribute('oncontextmenu','markCell(event)');
            div.setAttribute('onmouseover','enableHover(event.target.id)');
            div.setAttribute('onmouseout','disableHover(event.target.id)');
            div.style.cursor="not-allowed";
            table.append(div);   
        }
    }
}
function enableHover(id)
{
    let i = parseInt(parseInt(id)/10);
    let j = parseInt(id)%10;
    if(f[i][j])
    {
        document.getElementById(id).style.transform = "scale(1.2)";
    }
    else
    {
        document.getElementById(id).style.transform = "none";
    }
}
function disableHover(id)
{
    document.getElementById(id).style.transform = "none";
}

function setDifficulty()
{
    let i,j;
    for(i=0;i<n;i++)
    {
        for(j=0;j<n;j++)
        {
            let div=document.getElementById(i+''+j);
            div.innerHTML = '';
            div.style.cursor = "pointer";
            div.style.background = "rgba(255, 255,255,0.45)";
            a[i][j] = 0;
            f[i][j] = 1;
        }
    }
    let mines;
    let str = document.getElementById('difficulty').value;
    difficulty = str;
    if(str=='Easy')
        mines = 10;
    else if(str=='Medium')
        mines = 15;
    else
        mines = 20;
    cells_remaining = (n*n) - mines;
    flag = true;
    placeMines(mines);
}

function placeMines(mines)
{
    let i = 0,j;
    while( i < mines )
    {
        let x = Math.floor((Math.random() * n));
        let y = Math.floor((Math.random() * n));
        if(a[x][y]!=-1)
        {
            a[x][y]=-1;
            i++;
        }
    }
    for(i=0;i<n;i++)
    {
        for(j=0;j<n;j++)
        {
            if(a[i][j]==-1)
            {
                if(i-1>=0&&a[i-1][j]!=-1) a[i-1][j]++;
                if(i+1<n&&a[i+1][j]!=-1) a[i+1][j]++;
                if(j-1>=0&&a[i][j-1]!=-1) a[i][j-1]++;
                if(j+1<n&&a[i][j+1]!=-1) a[i][j+1]++;

                if(i-1>=0&&j-1>=0&&a[i-1][j-1]!=-1) a[i-1][j-1]++;
                if(i-1>=0&&j+1<n&&a[i-1][j+1]!=-1) a[i-1][j+1]++;
                if(i+1<n&&j-1>=0&&a[i+1][j-1]!=-1) a[i+1][j-1]++;
                if(i+1<n&&j+1<n&&a[i+1][j+1]!=-1) a[i+1][j+1]++;
            }
        }
    }
    document.getElementById('timer').innerHTML = '00:00';
    clearInterval(mytimer);
    mytimer = setInterval(updateTime,1000);

}

function displayCell(event)
{
    if(difficulty)
    {
        let id = event.target.id;
        let i = parseInt( parseInt(id)/10 );
        let j = parseInt(id)%10;
        let cell = document.getElementById(id);
        if(a[i][j] == -1)
        {
            cell.style.background = "rgba(255,0,0,0.7)";
            cell.style.transform = "none";
            cell.innerHTML = "💣";
            flag = false;
            clearInterval(mytimer);
            setTimeout(gameOver,1000);
        }
        else if(a[i][j]>=0&&flag&&f[i][j])
        {
            if(a[i][j])
            {
                f[i][j] = 0;
                cell.innerHTML = a[i][j];
                cell.style.background = "rgba(255, 255,255,0.7)";
                cell.style.transform = "none";
                cells_remaining--;
            }
            else
            {
                displayZero(i,j);
            }
        }
        
        if(cells_remaining==0)
        {
            for(i=0;i<n;i++)
            {
                for(j=0;j<n;j++)
                {
                    if(a[i][j] == -1)
                    {
                        cell = document.getElementById(i+''+j);
                        cell.innerHTML = "💣";
                        cell.style.transform = "none";
                    }
                }
            }
            flag = false;
            clearInterval(mytimer);
            setTimeout(gameOver,1000);
        }
    }
}
function displayZero(i,j)
{
    if(cells_remaining)
    {
        if(f[i][j])
        {
            f[i][j] = 0;
            let cell = document.getElementById(i+''+j);
            cell.style.background = "rgba(255, 255,255,0.7)";
            cell.style.transform = "none";
            if(a[i][j])
            {
                
                cell.innerHTML = a[i][j];
                cells_remaining--;
            }
            else
            {
                
                
                cells_remaining--;
                if(i-1>=0&&a[i-1][j]!=-1) displayZero(i-1,j);
                if(i+1<n&&a[i+1][j]!=-1) displayZero(i+1,j);
                if(j-1>=0&&a[i][j-1]!=-1) displayZero(i,j-1);
                if(j+1<n&&a[i][j+1]!=-1) displayZero(i,j+1);

                if(i-1>=0&&j-1>=0&&a[i-1][j-1]!=-1) displayZero(i-1,j-1);
                if(i-1>=0&&j+1<n&&a[i-1][j+1]!=-1) displayZero(i-1,j+1);
                if(i+1<n&&j-1>=0&&a[i+1][j-1]!=-1) displayZero(i+1,j-1);
                if(i+1<n&&j+1<n&&a[i+1][j+1]!=-1) displayZero(i+1,j+1);
            }
        }
    }
    return;
}
function markCell(event)
{
    if(difficulty)
    {
        let cell = document.getElementById(event.target.id);
        if(cell.innerHTML=='')
        {
            cell.innerHTML = "🚩";
        }
        else if(cell.innerHTML == "🚩")
        {
            cell.innerHTML="";
        }
    }
    event.preventDefault();
}


function updateTime()
{
    let time = document.getElementById('timer').innerHTML;
    let mm = parseInt(time[0]+time[1]);
    let ss = parseInt(time[3]+time[4]);
    ss=(ss+1)%60;
    if(!ss)
    {
        mm++;
    }
    time='';
    if(mm<10)
        time += '0';
    time = time+mm+':';
    if(ss<10)
        time += '0';
    time+=ss;

    document.getElementById('timer').innerHTML = time;
    if(mm==60)
    {
        window.location.reload();
    }
    
}

function gameOver()
{
    let content = document.querySelector('.content');
    let row = document.querySelectorAll('.row');
    for(let i=0;i<row.length;i++)
    {
        row[i].style.display = "none";    
    }
    
    let btn = document.createElement('button');
    btn.className = 'play-again-btn';
    btn.innerHTML = "PLAY AGAIN";
    btn.setAttribute('onclick','playAgain()');
    let div = document.createElement('div');
    div.className = 'play-again-text';

    if(!cells_remaining)
    {
        let time = document.getElementById('timer').innerHTML;
        let mm = parseInt(time[0]+time[1]);
        let ss = parseInt(time[3]+time[4]);   
        let score = (mm * 60) + ss;
        let x=1;
        if(difficulty == 'Medium')
            x = 2;
        else if(difficulty == 'Easy')
            x = 3;
        score = Math.ceil((3600-score)/x);

        div.innerHTML = 'Your Score is: '+ score; 
        highscore = parseInt(localStorage.getItem('High Score'));
        if(highscore < score)
            localStorage.setItem('High Score',score);
    }
    else
    {
        div.innerHTML = 'You lost....Try once more?'
    }
    content.append(div);
    content.append(btn);
}

function playAgain()
{
    window.location.reload();
}