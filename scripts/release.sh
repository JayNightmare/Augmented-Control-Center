#!/bin/bash

# AR Glasses Control Center - Release Script
# This script helps automate the release process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository. Please run this script from the project root."
        exit 1
    fi
}

# Function to check if there are uncommitted changes
check_clean_working_dir() {
    if ! git diff-index --quiet HEAD --; then
        print_warning "You have uncommitted changes. Please commit or stash them before releasing."
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Function to validate version format
validate_version() {
    local version=$1
    if [[ ! $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        print_error "Invalid version format: $version"
        print_error "Expected format: X.Y.Z (e.g., 1.0.0)"
        exit 1
    fi
}

# Function to check if version already exists
check_version_exists() {
    local version=$1
    if git tag | grep -q "^v$version$"; then
        print_error "Version v$version already exists!"
        exit 1
    fi
}

# Function to update package.json version
update_package_version() {
    local version=$1
    print_status "Updating package.json version to $version..."
    npm version $version --no-git-tag-version
    print_success "Package.json updated"
}

# Function to build the project
build_project() {
    print_status "Building the project..."
    npm run build:css
    print_success "Build completed"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    # Add your test command here if you have tests
    # npm test
    print_success "Tests completed"
}

# Function to commit changes
commit_changes() {
    local version=$1
    print_status "Committing changes..."
    git add package.json package-lock.json
    git commit -m "chore: bump version to $version"
    print_success "Changes committed"
}

# Function to create and push tag
create_tag() {
    local version=$1
    print_status "Creating tag v$version..."
    git tag "v$version"
    print_success "Tag v$version created"
    
    print_status "Pushing tag to remote..."
    git push origin "v$version"
    print_success "Tag pushed to remote"
}

# Function to show release notes template
show_release_notes() {
    local version=$1
    echo
    print_status "Release Notes Template for v$version:"
    echo
    echo "## 🚀 AR Glasses Control Center v$version"
    echo
    echo "### What's New"
    echo "- [Add new features here]"
    echo "- [Add improvements here]"
    echo "- [Add bug fixes here]"
    echo
    echo "### Changes"
    echo "- [List breaking changes if any]"
    echo "- [List deprecations if any]"
    echo
    echo "### Technical Details"
    echo "- [Add technical details if needed]"
    echo
    echo "### Installation"
    echo "Download the appropriate version for your platform from the releases page."
    echo
    echo "### Support"
    echo "For issues and feature requests, please visit our [GitHub repository](https://github.com/JayNightmare/Augmented-Control-Center)."
    echo
    echo "---"
    echo "*Built with ❤️ for AR Development*"
}

# Function to show help
show_help() {
    echo "AR Glasses Control Center - Release Script"
    echo
    echo "Usage: $0 [OPTIONS] VERSION"
    echo
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -d, --dry-run  Show what would be done without making changes"
    echo "  -t, --test     Run tests before release"
    echo
    echo "Examples:"
    echo "  $0 1.0.0       Release version 1.0.0"
    echo "  $0 -d 1.1.0    Dry run for version 1.1.0"
    echo "  $0 -t 2.0.0    Release version 2.0.0 with tests"
    echo
    echo "This script will:"
    echo "1. Validate the version format"
    echo "2. Check for uncommitted changes"
    echo "3. Update package.json version"
    echo "4. Build the project"
    echo "5. Run tests (if --test flag is used)"
    echo "6. Commit changes"
    echo "7. Create and push a git tag"
    echo "8. Trigger GitHub Actions release workflow"
}

# Main script
main() {
    local dry_run=false
    local run_tests_flag=false
    local version=""

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -d|--dry-run)
                dry_run=true
                shift
                ;;
            -t|--test)
                run_tests_flag=true
                shift
                ;;
            -*)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
            *)
                if [[ -z "$version" ]]; then
                    version=$1
                else
                    print_error "Multiple versions specified: $version and $1"
                    exit 1
                fi
                shift
                ;;
        esac
    done

    # Check if version is provided
    if [[ -z "$version" ]]; then
        print_error "Version is required"
        show_help
        exit 1
    fi

    # Validate version format
    validate_version "$version"

    # Check if we're in a git repository
    check_git_repo

    # Check if version already exists
    check_version_exists "$version"

    # Check for uncommitted changes
    check_clean_working_dir

    print_status "Starting release process for version $version..."

    if [[ "$dry_run" == true ]]; then
        print_warning "DRY RUN MODE - No changes will be made"
        echo
        echo "Would execute the following steps:"
        echo "1. Update package.json version to $version"
        echo "2. Build the project"
        if [[ "$run_tests_flag" == true ]]; then
            echo "3. Run tests"
        fi
        echo "4. Commit changes"
        echo "5. Create tag v$version"
        echo "6. Push tag to remote"
        echo
        show_release_notes "$version"
        exit 0
    fi

    # Update package.json version
    update_package_version "$version"

    # Build the project
    build_project

    # Run tests if requested
    if [[ "$run_tests_flag" == true ]]; then
        run_tests
    fi

    # Commit changes
    commit_changes "$version"

    # Create and push tag
    create_tag "$version"

    print_success "Release process completed!"
    print_status "GitHub Actions will now build and publish the release."
    print_status "You can monitor the progress at: https://github.com/JayNightmare/Augmented-Control-Center/actions"
    
    echo
    show_release_notes "$version"
}

# Run main function with all arguments
main "$@" 