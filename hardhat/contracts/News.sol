// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract News {
    uint256 constant POST_STAKE = 0.01 ether;
    uint256 constant VOTE_STAKE = 0.001 ether;
    uint256 constant WITHDRAW_PERIOD = 30 days;
    uint256 constant GOVERNANCE_REWARD_PERCENTAGE = 10;

    struct Article {
        uint256 articleId;
        string title;
        string content;
        uint256 timestamp;
        address author;
        uint256 likes;
        uint256 dislikes;
    }

    mapping(uint256 => Article) public articles;
    mapping(address => uint256) public stakedAmounts;
    mapping(uint256 => mapping(address => bool)) public voters;
    mapping(uint256 => uint256) lastProcessedTime;
    address public owner;
    address public proposedOwner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    modifier requirePostStake() {
        require(
            msg.value >= POST_STAKE,
            "Staked amount not enough to post article!"
        );
        _;
    }

    modifier requireVoteStake() {
        require(
            msg.value >= VOTE_STAKE,
            "Staked amount not enough to vote article!"
        );
        _;
    }

    event NewArticle(
        uint256 indexed articleId,
        string title,
        uint256 timestamp,
        address indexed author
    );

    event GovernanceRewardDistributed(
        address indexed contributor,
        uint256 rewardAmount
    );

    event NewVote(
        uint256 indexed articleId,
        address indexed voter,
        bool vote,
        uint256 timestamp
    );

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address _proposedOwner) public onlyOwner {
        proposedOwner = _proposedOwner;
    }

    function claimOwnership() public {
        require(
            msg.sender == proposedOwner,
            "Only the proposed owner can claim ownership."
        );
        emit OwnershipTransferred(owner, proposedOwner);
        owner = proposedOwner;
        proposedOwner = address(0);
    }

    function postArticle(
        uint256 articleId,
        string memory title,
        string memory content
    ) public payable requirePostStake {
        require(
            articles[articleId].articleId == 0,
            "Article ID already exists"
        );

        Article memory newArticle = Article({
            articleId: articleId,
            title: title,
            content: content,
            timestamp: block.timestamp,
            author: msg.sender,
            likes: 0,
            dislikes: 0
        });

        articles[articleId] = newArticle;
        stakedAmounts[msg.sender] += msg.value;
        lastProcessedTime[articleId] = block.timestamp;

        emit NewArticle(articleId, title, block.timestamp, msg.sender);
    }

    function getArticle(uint256 articleId)
        external
        view
        returns (Article memory)
    {
        return articles[articleId];
    }

    function vote(uint256 articleId, bool isLike)
        public
        payable
        requireVoteStake
    {
        Article storage article = articles[articleId];
        require(article.articleId != 0, "Article does not exist");
        require(
            !voters[articleId][msg.sender],
            "Already voted for this article"
        );

        voters[articleId][msg.sender] = true;

        if (isLike) {
            article.likes += 1;
        } else {
            article.dislikes += 1;
        }

        stakedAmounts[msg.sender] += msg.value;
        emit NewVote(articleId, msg.sender, isLike, block.timestamp);
    }

    function processArticle(uint256 articleId) public onlyOwner {
        Article storage article = articles[articleId];
        require(article.articleId != 0, "Article does not exist");

        if (article.likes > article.dislikes) {
            // Accept the article into feed
            // Make all the staked amount of dislikers to 0 to ensure the votes are invalid for rewards
            address[] memory votersList = getVotersList(articleId);
            for (uint256 i = 0; i < votersList.length; i++) {
                address voter = votersList[i];
                if (voters[articleId][voter]) continue;
                stakedAmounts[voter] = 0;
            }
        } else if (article.likes < article.dislikes) {
            // Delete the post from feed
            delete articles[articleId];
            // Make all the staked amount of likers to 0 to ensure the votes are invalid for rewards
            address[] memory votersList = getVotersList(articleId);
            for (uint256 i = 0; i < votersList.length; i++) {
                address voter = votersList[i];
                if (!voters[articleId][voter]) continue;
                stakedAmounts[voter] = 0;
            }
        }
    }

    function withdraw() public onlyOwner {
        require(
            block.timestamp >= articles[1].timestamp + WITHDRAW_PERIOD,
            "Withdraw period has not ended yet"
        );

        uint256 totalStakedAmount = address(this).balance -
            stakedAmounts[owner];
        uint256 governanceRewardAmount = (totalStakedAmount *
            GOVERNANCE_REWARD_PERCENTAGE) / 100;

        payable(owner).transfer(governanceRewardAmount);
        address[] memory contributors = getContributors();
        for (uint256 i = 0; i < contributors.length; ++i) {
            address contributor = contributors[i];
            uint256 contributorRewardAmount = totalStakedAmount *
                (stakedAmounts[contributor] / address(this).balance);
            payable(contributor).transfer(contributorRewardAmount);

            emit GovernanceRewardDistributed(
                contributor,
                contributorRewardAmount
            );
        }
    }

    function getContributors() internal view returns (address[] memory) {
        address[] memory contributors;
        uint256 numContributors = 0;
        for (uint256 i = 0; i < contributors.length; ++i) {
            address contributor = contributors[i];
            if (stakedAmounts[contributor] > 0) {
                numContributors += 1;
                contributors[numContributors] = contributor;
            }
        }
        return contributors;
    }

    function getVotersList(uint256 articleId)
        internal
        view
        returns (address[] memory)
    {
        address[] memory votersList;
        uint256 numVoters = 0;
        for (uint256 i = 0; i < votersList.length; i++) {
            address voter = votersList[i];
            if (voters[articleId][voter]) {
                numVoters += 1;
                votersList[numVoters] = voter;
            }
        }
        return votersList;
    }

    /* function processArticlesAtIntervals() public {
        for (uint i = 0; i <= maxArticleId; i++) {
            if (lastProcessedTime[i] + 1 days <= block.timestamp) {
                processArticle(i);
                lastProcessedTime[i] = block.timestamp; // update last processed time
            }
        }
    } */

    receive() external payable {}
}
