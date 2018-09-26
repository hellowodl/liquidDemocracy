/*nphias*/

const genesis = () => {
    var result = commit('directoryLink', {Links:[
        {Base: App.DNA.Hash, Link: App.Agent.Hash, Tag: 'has user'},
    ]})
    //debug(result)
    return true;
};


const proposalEntryCreate = (proposal) => {
    const phash = commit('proposalEntry', proposal);
    const collectionHash =  commit('proposalLink', {Links:[
        {Base: App.Agent.Hash, Link: phash, Tag: 'has proposals'},
    ]})
    return phash;
}

const proposalGetEntry = (proposalhash) => {
    let proposal = get(proposalhash);
    //debug(proposal)
    return proposal
}

const getUsers = () => {
    var userList = getLinks(App.DNA.Hash, 'has user', { Load: true });
    //debug(userList);
    return userList
}

const proposalGetCollection = (userhash) => {
    let collectionList = getLinks(userhash, 'has proposals', { Load: true })
    //debug(collectionList)
    return (collectionList)
}

const vote = (params:{proposalHash:string, option:string}) => {  //TODO Add validation
    const vote = commit('voteLink', {Links:[
        { Base: params.proposalHash, Link: App.Agent.Hash, Tag: params.option} ]})
        //debug(vote)
    return true
}

const getVotes = (proposalhash) => {
    const votes = getLinks(proposalhash, '', { Load: true });
    //debug(votes)
    return votes
}






const getTopicDirectory = () => {
    var directory = getLinks(App.DNA.Hash, 'contains', { Load: true })
    return directory
}

const addVotesToLinks = (i) => {
    i.Entry.votes = countVotes({hash: i.Hash})
    return i
}
const hasVoted = (proposalHash) => {
    const votes = getLinks(proposalHash, '', { Load: true })

    const myVote = votes.filter(vote => vote.Hash === getMe())

    if (myVote.length === 0)
        return false
    else
        return true
}

/*const vote = (params: {proposalHash: string, value: number}) => {
    const proposal = proposalGetEntry(params.proposalHash)

    if (hasVoted(params.proposalHash))
        return false
    // If the provided choice is out of bound
    if (params.value >= proposal.values.length)
        return false

    const vote = commit('vote', { Links: [ {
        Base: params.proposalHash,
        Link: getMe(),
        Tag: params.value
    } ]})

    //const voteBacklink = commit('vote', { Links: [ {
    //    Base: getMe(),
     //   Link: params.proposalHash,
     //   Tag: params.value
   // } ]})
    debug(vote)
    return {
        voteHash: vote,
      //  voteBacklinkHash: voteBacklink
    };
}*/

const removeDelegations = (params: { targetHash: string }) => {
    const delegations = getLinks(params.targetHash, 'delegation')

    if (delegations.length === 0)
        return false

    const delegationsRes = delegations.map(x => ({
        Base: x.Source,
        Link: x.Hash,
        LinkAction: HC.LinkAction.Del
    }))

    // Create array of backlinks
    const delegationBacklinksRes = delegationsRes.map(x => ({
        ...x,
        Base: x.Link,
        Link: x.Base
    }))

    commit('delegate', delegationsRes)
    commit('delegateBacklink', delegationBacklinksRes)
}

const delegate = (params: { targetHash: string}) => {
    removeDelegations(params)

    commit('delegate', { Links: [ {
        Base: getMe(),
        Link: params.targetHash,
        Tag: 'delegate'
    } ]})

    commit('delegate', { Links: [ {
            Base: getMe(),
            Link: params.targetHash,
            Tag: 'delegateBacklink'
    } ]})
}


const countVotes = (params: {
    hash: string
}) => {
    const res = {}
    const votes = getLinks(params.hash, '', { Load: true });

    votes
        .map((vote) => Number(vote.Tag))
        .forEach(x => res[x] = (res[x] || 0) + 1)

    return res
}

const getMe = () => {
    return App.Key.Hash
}

//validation
const validateCommit = (entryName, entry, header, pkg, sources) => {
    switch (entryName) {
        case "proposalEntry":
            return true;
        case "directoryLink":
            return true;
        case "proposalLink":
            return true;
        case "voteLink":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validatePut = (entryName, entry, header, pkg, sources) => {
    switch (entryName) {
        case "proposalEntry":
            return true;
        case "directoryLink":
            return true;
        case "voteLink":
            return true;
        case "proposalLink":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validateMod = (entryName, entry, header, replaces, pkg, sources) => {
    switch (entryName) {
        case "proposalEntry":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validateDel = (entryName, hash, pkg, sources) => {
    switch (entryName) {
        case "proposalEntry":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validateLink = (linkEntryType, baseHash, links, pkg, sources) => {
    switch (linkEntryType) {
        case "voteLink":
            return true;
        case "proposalLink":
            return true;
        case "directoryLink":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validatePutPkg = (entryName) => {
    return null;
}

const validateModPkg = (entryName) => {
    return null;
}

const validateDelPkg = (entryName) => {
    return null;
}

const validateLinkPkg = (entryName) => {
    return null;
}